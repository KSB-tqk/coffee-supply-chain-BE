import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
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
          //update fields
          if (transport.state == 2)
            return res.status(400).send({
              error:
                "Transport infomation cannot be update because it has been completed",
            });
          for (var field in TransportModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                transport[field] = req.body[field];
              }
            }
          }
          if (transport.state == 2) {
            transport.dateCompleted = Date.now();
          }
          transport.save();
          const transportPop = await TransportModel.findById(transport._id)
            .populate("projectId")
            .populate("inspector");
          res.status(200).send({
            transport: transportPop,
            contractContent:
              Date.now().toString() +
              "|" +
              transport.inspector.toString() +
              "|Transport|" +
              transport.state,
          });
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
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      transport.inspector = user._id;
      transport.save();

      res.status(200).send(transport);
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
};

export default transportController;
