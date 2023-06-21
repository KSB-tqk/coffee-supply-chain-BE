import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const transportSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  projectCode: {
    type: String,
    default: "",
  },
  transportId: {
    type: String,
    trim: true,
    default: "",
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  transportCompany: {
    type: String,
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  vehicle: {
    type: String,
    default: "",
  },
  numberOfVehicle: {
    type: Number,
    default: 0,
  },
  dateCompleted: {
    type: Date,
    default: null,
  },
  dateExpected: {
    type: Date,
    default: null,
  },
  state: {
    type: Number,
    default: 5,
  },
  note: [String],
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
transportSchema.pre("save", async function (next) {
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
const transportModel = mongoose.model("Transport", transportSchema);

export default transportModel;
