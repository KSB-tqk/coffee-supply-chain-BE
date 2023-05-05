import { BASE_TRANSACTION_URL, ERROR_MESSAGE } from "../../enum/app_const.js";
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
      return res.status(400).send(onError(400, "This step log doesn't exist"));
    }

    StepLogModel.findOne({ _id: id }, async function (err, stepLog) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        for (var field in StepLogModel.schema.paths) {
          if (
            field !== "_id" &&
            field !== "__v" &&
            field !== "projectId" &&
            field !== "inspector"
          ) {
            if (req.body[field] !== undefined) {
              stepLog[field] = req.body[field];
            }
          }
        }

        console.log(
          "transaction hash url" +
            BASE_TRANSACTION_URL +
            req.body.transactionHash
        );

        stepLog.transactionUrl =
          BASE_TRANSACTION_URL + req.body.transactionHash;

        await stepLog.save();
        const stepLogPop = await StepLogModel.findById(stepLog._id);
        // .populate("projectId")
        // .populate("actor");
        res.status(200).send(stepLogPop);
      }
    });
  },
  deleteStepLog: async (req, res) => {
    try {
      const id = req.params.id;

      const stepLog = await StepLogModel.findByIdAndDelete(id).exec();

      if (!stepLog) {
        return res.status(400).send(onError(400, "This stepLog doesn't exist"));
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
        return res.status(400).send(onError(400, "This stepLog doesn't exist"));
      }

      res.status(200).send(stepLog);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
};

export default stepLogController;
