import { ObjectId } from "mongodb";
import { BASE_TRANSACTION_URL, ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import { sendData } from "../../helper/blockchain_helper.js";
import {
  findDuplicates,
  getUserIdByHeader,
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import { isValidTransportStateUpdate } from "../../helper/transport/transport_data_helper.js";
import StepLogModel from "../../model/step_log/step_log.js";
import TransportModel from "../../model/transport/transport.js";
import User from "../../model/user/user.js";

const transportController = {
  addTransport: async (req, res) => {
    try {
      const transport = new TransportModel(req.body);

      transport.transportId = transport._id;

      await transport.save();

      res.status(200).send({ msg: "Create transport successfully", transport });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  updateTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id).exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      TransportModel.findOne({ _id: id }, async function (err, transport) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          // save model before change
          let stepLog = StepLogModel();
          stepLog.projectId = transport.projectId;
          stepLog.actor = ObjectId(
            await getUserIdByHeader(req.header("Authorization"))
          );
          stepLog.modelBeforeChanged = JSON.stringify(transport);
          console.log("steplog before save", stepLog);
          await stepLog.save();

          // push current stepLog into logList in transport model
          if (transport.logList == null) transport.logList = [];
          transport.logList = transport.logList.concat({ log: stepLog._id });
          transport.logId = stepLog._id;

          const oldState = transport.state;

          //update fields
          if (transport.state == 2)
            return res
              .status(400)
              .send(
                onError(
                  400,
                  "Transport infomation cannot be update because it has been completed"
                )
              );
          for (var field in TransportModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                transport[field] = req.body[field];
              }
            }
          }

          // if (req.body.logList != null) {
          //   if (!findDuplicates(transport.logList))
          //     for (let i = 0; i < transport.logList.length; i++) {
          //       if (transport.logList[i].transactionUrl == null) {
          //         transport.logList[i].transactionUrl =
          //           BASE_TRANSACTION_URL + transport.logList[i].transactionId;
          //       }
          //     }
          //   else
          //     return res
          //       .status(400)
          //       .send(
          //         onError(
          //           400,
          //           "Some transaction are duplicated" + ERROR_MESSAGE
          //         )
          //       );
          // }

          //await sendData(stepLog._id);

          // check whether the body of the updated model has any invalid field
          // [state] must be State.Pending
          // [projectId] and [inspector] must not be null
          // [projectCode] must not be empty
          if (req.body.state != null)
            try {
              if (
                !(await isValidTransportStateUpdate(
                  transport,
                  req.body.state,
                  oldState
                ))
              )
                return res
                  .status(400)
                  .send(onError(400, "Invalid Update" + ERROR_MESSAGE));
            } catch (err) {
              return res.status(400).send(onError(400, err.message));
            }

          if (transport.state == 2) {
            transport.dateCompleted = Date.now();
          }
          await transport.save();
          const transportPop = await TransportModel.findById(transport._id)
            .populate("projectId")
            .populate("inspector");
          res.status(200).send(transportPop);

          // save the transport model after changed
          // save the model after changed
          stepLog = await StepLogModel.findById(transportPop.logId);
          stepLog.modelAfterChanged = JSON.stringify(transport);
          console.log("Step Log Final", stepLog);
          stepLog.save();
        }
      });
    } catch (e) {
      res.status(500).send(onError(500, e.toString()));
    }
  },
  deleteTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id).exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      const transportChangeState = await TransportModel.findById(id);
      transportChangeState.state = 3;
      transportChangeState.save();
      res.status(200).send({ msg: "Delete transport success" });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getAllTransport: async (req, res) => {
    try {
      const transport = await TransportModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();
      res.status(200).send(transport.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      res.status(200).send(transport);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  addTransportSupervision: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.email });
      const transport = await TransportModel.findById(req.query.transportId);

      if (transport == null)
        return res
          .status(404)
          .send(onError(404, "Transport Not Found" + ERROR_MESSAGE));

      if (transport.inspector != null) {
        const inspector = await User.findById(transport.inspector);
        if (inspector == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "Transport already has an inspector which does not exist in the database" +
                  ERROR_MESSAGE
              )
            );
        return res
          .status(404)
          .send(
            onError(404, "Transport already has an inspector" + ERROR_MESSAGE)
          );
      }

      if (user == null)
        return res
          .status(404)
          .send(
            onError(404, "Email does not link to any account" + ERROR_MESSAGE)
          );

      if (
        !(await onValidUserDepartment(user, [
          UserDepartment.TransportSupervision,
        ]))
      )
        return res
          .status(400)
          .send(
            onError(
              400,
              "User is not participate in this department" + ERROR_MESSAGE
            )
          );

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
          UserRole.TechAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      transport.inspector = user._id;
      await transport.save();

      const resTransport = await TransportModel.findById(transport.transportId).populate({path: 'inspector'});

      res.status(200).send(resTransport);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  removeTransportSupervision: async (req, res) => {
    try {
      const transport = await TransportModel.findById(req.query.transportId);

      if (transport == null)
        return res
          .status(404)
          .send(onError(404, "Transport Not Found" + ERROR_MESSAGE));

      if (transport.inspector == null) {
        return res
          .status(404)
          .send(
            onError(
              404,
              "Transport does not has an inspector yet" + ERROR_MESSAGE
            )
          );
      }

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
          UserRole.TechAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      transport.inspector = null;
      transport.save();

      res.status(200).send(transport);
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },

  getAllTransportByUserId: async (req, res) => {
    try {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(400)
          .send(onError(400, "User Not Found" + ERROR_MESSAGE));

      const transportList = await TransportModel.find({ inspector: user._id })
        .populate("projectId")
        .populate("inspector");

      if (!transportList)
        return res
          .status(404)
          .send(
            onError(
              404,
              "No transport was found contain this inspector" + ERROR_MESSAGE
            )
          );

      res.status(200).send(transportList.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default transportController;
