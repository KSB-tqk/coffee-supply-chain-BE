import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import HarvestModel from "../../model/harvest/harvest.js";
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
      return res.status(400).send(onError("This harvest doesn't exist"));
    }

    HarvestModel.findOne({ _id: id }, async function (err, harvest) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        if (harvest.state == 2)
          return res.status(400).send({
            error:
              "Harvest infomation cannot be update because it has been completed",
          });
        for (var field in HarvestModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              harvest[field] = req.body[field];
            }
          }
        }

        if (harvest.state == 2) {
          harvest.dateCompleted = Date.now();
        }

        harvest.save();
        const harvestPop = await HarvestModel.findById(harvest._id)
          .populate("projectId")
          .populate("inspector");
        res.status(200).send({
          harvest: harvestPop,
          contractContent:
            Date.now().toString() +
            "|" +
            harvest.inspector.toString() +
            "|Harvest|" +
            harvest.state,
        });
      }
    });
  },
  deleteHarvest: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await HarvestModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).send(onError("This harvest doesn't exist"));
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
        return res.status(400).send(onError("This harvest doesn't exist"));
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
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      harvest.inspector = user._id;
      harvest.save();

      res.status(200).send(harvest);
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
};

export default harvestController;
