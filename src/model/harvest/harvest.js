import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const harvestSchema = mongoose.Schema({
  harvestId: {
    type: String,
    trim: true,
    default: null,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  totalHarvest: {
    type: Number,
    default: 0,
  },
  ripeness: {
    type: Number,
    default: 0,
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
  state: {
    type: Number,
    required: true,
    default: 5,
  },
  projectCode: {
    type: String,
    default: "",
  },
  moisture: {
    type: Number,
    default: 0,
  },
  temperature: {
    type: Number,
    default: 0,
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

//Hash the plain text pwd before saving
harvestSchema.pre("save", async function (next) {
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

const harvestModel = mongoose.model("Harvest", harvestSchema);

export default harvestModel;
