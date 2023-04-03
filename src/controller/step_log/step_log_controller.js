import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import StepLogModel from "../../model/step_log/step_log.js";
import User from "../../model/user/user.js";
const stepLogController = {
  addStepLog: async (req, res) => {
    try {
      const stepLog = new StepLogModel(req.body);
      await stepLog.save();

      res.status(200).send({ msg: "Create stepLog successfully", stepLog });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  updateStepLog: async (req, res) => {
    const id = req.params.id;

    const stepLog = await StepLogModel.findById(id).exec();

    if (!stepLog) {
      return res.status(400).send(onError("This stepLog doesn't exist"));
    }

    StepLogModel.findOne({ _id: id }, async function (err, stepLog) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        if (stepLog.state == 2)
          return res.status(400).send({
            error:
              "StepLog infomation cannot be update because it has been completed",
          });
        for (var field in StepLogModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              stepLog[field] = req.body[field];
            }
          }
        }

        if (stepLog.state == 2) {
          stepLog.dateCompleted = Date.now();
        }

        stepLog.save();
        const stepLogPop = await StepLogModel.findById(stepLog._id)
          .populate("projectId")
          .populate("actor");
        res.status(200).send(stepLogPop);
      }
    });
  },
  deleteStepLog: async (req, res) => {
    try {
      const id = req.params.id;

      const stepLog = await StepLogModel.findByIdAndDelete(id).exec();

      if (!stepLog) {
        return res.status(400).send(onError("This stepLog doesn't exist"));
      }

      res.status(200).send({ msg: "Delete stepLog success" });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getAllStepLogs: async (req, res) => {
    try {
      const stepLog = await StepLogModel.find()
        .populate("projectId")
        .populate("actor")
        .exec();

      res.status(200).send(stepLog.reverse());
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getStepLog: async (req, res) => {
    try {
      const id = req.params.id;

      const stepLog = await StepLogModel.findById(id)
        .populate("projectId")
        .populate("actor")
        .exec();

      if (!stepLog) {
        return res.status(400).send(onError("This stepLog doesn't exist"));
      }

      res.status(200).send(stepLog);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
};

export default stepLogController;
