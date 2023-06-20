import { ObjectId } from "mongodb";
import { BASE_TRANSACTION_URL, ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  findDuplicates,
  getUserIdByHeader,
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import { isValidHarvestStateUpdate } from "../../helper/harvest/harvest_data_helper.js";
import { isValidTransportStateUpdate } from "../../helper/transport/transport_data_helper.js";
import HarvestModel from "../../model/harvest/harvest.js";
import StepLogModel from "../../model/step_log/step_log.js";
import User from "../../model/user/user.js";
const harvestController = {
  addHarvest: async (req, res) => {
    try {
      const harvest = new HarvestModel(req.body);

      harvest.harvestId = harvest._id;
      await harvest.save();

      res.status(200).send({ msg: "Create harvest successfully", harvest });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  updateHarvest: async (req, res) => {
    const id = req.params.id;

    const harvest = await HarvestModel.findById(id).exec();

    if (!harvest) {
      return res.status(400).send(onError(400, "This harvest doesn't exist"));
    }

    HarvestModel.findOne({ _id: id }, async function (err, harvest) {
      if (err) {
        res
          .status(422)
          .send(onError(422, "Update harvest failed" + ERROR_MESSAGE));
      } else {
        // save model before change
        let stepLog = StepLogModel();
        stepLog.projectId = harvest.projectId;
        stepLog.actor = ObjectId(
          await getUserIdByHeader(req.header("Authorization"))
        );
        stepLog.modelBeforeChanged = JSON.stringify(harvest);
        console.log("steplog before save", stepLog);
        await stepLog.save();

        // push current stepLog into logList in harvest model
        if (harvest.logList == null) harvest.logList = [];
        harvest.logList = harvest.logList.concat({ log: stepLog._id });
        harvest.logId = stepLog._id;

        const oldState = harvest.state;

        //update fields
        if (harvest.state == 2)
          return res
            .status(400)
            .send(
              onError(
                400,
                "Harvest infomation cannot be update because it has been completed"
              )
            );
        for (var field in HarvestModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              harvest[field] = req.body[field];
              console.log("harvest update field: ", harvest[field]);
            }
          }
        }

        if (req.body.transactionList != null) {
          if (!findDuplicates(harvest.transactionList))
            for (let i = 0; i < harvest.transactionList.length; i++) {
              if (harvest.transactionList[i].transactionUrl == null) {
                harvest.transactionList[i].transactionUrl =
                  BASE_TRANSACTION_URL +
                  harvest.transactionList[i].transactionId;
              }
            }
          else
            return res
              .status(400)
              .send(
                onError(400, "Some transaction are duplicated" + ERROR_MESSAGE)
              );
        }

        // check whether the body of the updated model has any invalid field
        // [state] must be State.Pending
        // [projectId] and [inspector] must not be null
        // [projectCode] must not be empty
        if (req.body.state != null)
          try {
            if (
              !(await isValidHarvestStateUpdate(
                harvest,
                req.body.state,
                oldState
              ))
            )
              return res
                .status(400)
                .send(onError(400, "Invalid State Update" + ERROR_MESSAGE));
          } catch (err) {
            return res.status(400).send(onError(400, err.message));
          }

        if (harvest.state == 2) {
          harvest.dateCompleted = Date.now();
        }

        await harvest.save();
        const harvestPop = await HarvestModel.findById(harvest._id)
          .populate("projectId")
          .populate("inspector");
        res.status(200).send({
          harvest: harvestPop,
        });

        // save the harvest model after changed
        // save the model after changed
        stepLog = await StepLogModel.findById(harvestPop.logId);
        stepLog.modelAfterChanged = JSON.stringify(harvest);
        console.log("Step Log Final", stepLog);
        stepLog.save();
      }
    });
  },
  deleteHarvest: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await HarvestModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).send(onError(400, "This harvest doesn't exist"));
      }

      const harvestChangeState = await HarvestModel.findById(id);
      harvestChangeState.state = 3;
      harvestChangeState.save();
      res.status(200).send({ msg: "Delete harvest success" });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getAllHarvests: async (req, res) => {
    try {
      const harvest = await HarvestModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();

      res.status(200).send(harvest.reverse());
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getHarvest: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await HarvestModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!harvest) {
        return res.status(400).send(onError(400, "This harvest doesn't exist"));
      }

      res.status(200).send(harvest);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },

  addHarvestor: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.email });
      const harvest = await HarvestModel.findById(req.query.harvestId);

      if (harvest == null)
        return res
          .status(404)
          .send(onError(404, "Harvest Not Found" + ERROR_MESSAGE));

      if (harvest.inspector != null) {
        const inspector = await User.findById(harvest.inspector);
        if (inspector == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "Harvest already has an inspector which does not exist in the database" +
                  ERROR_MESSAGE
              )
            );
        return res
          .status(404)
          .send(
            onError(404, "Harvest already has an inspector" + ERROR_MESSAGE)
          );
      }

      if (user == null)
        return res
          .status(404)
          .send(
            onError(404, "Email does not link to any account" + ERROR_MESSAGE)
          );

      if (
        !(await onValidUserDepartment(user, [UserDepartment.HarvestInspector]))
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

      harvest.inspector = user._id;
      await harvest.save();

      const responseHarvest = await HarvestModel.findById(harvest._id).populate({path: 'inspector'});

      console.log(responseHarvest);

      res.status(200).send(responseHarvest);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  removeHarvestor: async (req, res) => {
    try {
      const harvest = await HarvestModel.findById(req.query.harvestId);

      if (harvest == null)
        return res
          .status(404)
          .send(onError(404, "Harvest Not Found" + ERROR_MESSAGE));

      if (harvest.inspector == null) {
        return res
          .status(404)
          .send(
            onError(
              404,
              "Harvest does not has an inspector yet" + ERROR_MESSAGE
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

      harvest.inspector = null;
      harvest.save();

      res.status(200).send(harvest);
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },

  getAllHarvestByUserId: async (req, res) => {
    try {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(400)
          .send(onError(400, "User Not Found" + ERROR_MESSAGE));

      const harvestList = await HarvestModel.find({ inspector: user._id })
        .populate("projectId")
        .populate("inspector");

      if (!harvestList)
        return res
          .status(404)
          .send(
            onError(
              404,
              "No harvest was found contain this inspector" + ERROR_MESSAGE
            )
          );

      res.status(200).send(harvestList.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default harvestController;
