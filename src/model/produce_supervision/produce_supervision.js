import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const produceSupervisionSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  produceSupervisionId: {
    type: String,
    default: null,
  },
  totalInput: {
    type: Number,
  },
  factory: {
    type: String,
    ref: "Factory",
    default: "",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  dateCompleted: {
    type: Date,
    default: null,
  },
  totalProduct: {
    type: Number,
  },
  humidity: {
    type: Number,
  },
  dryingTemperature: {
    type: Number,
  },
  expiredDate: {
    type: Date,
    default: null,
  },
  state: {
    type: Number,
    default: 5,
  },
  note: {
    type: String,
    default: null,
  },
  projectCode: {
    type: String,
    default: "",
  },
  transactionList: [
    {
      transactionId: {
        type: String,
        default: null,
      },
      transactionAddress: {
        type: String,
        default: null,
      },
      transactionUrl: {
        type: String,
        default: null,
      },
    },
  ],
  logList: [
    {
      log: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StepLog",
        default: null,
      },
    },
  ],
  logId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StepLog",
    default: null,
  },
});

produceSupervisionSchema.pre("save", async function (next) {
  const modifiedPaths = this.modifiedPaths().toString();

  const stepLogId = this.logId;

  if (stepLogId != null) {
    const stepLog = await StepLogModel.findById(stepLogId);
    console.log("steplog after save", stepLog);
    stepLog.action = "Modified field: " + modifiedPaths;
    await stepLog.save();
  }

  next();
});

const ProduceSupervisionModel = mongoose.model(
  "ProduceSupervision",
  produceSupervisionSchema
);
export default ProduceSupervisionModel;
