import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const warehouseStorageSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  totalInput: {
    type: Number,
  },
  warehouseStorageId: {
    type: String,
    default: null,
  },
  warehouse: {
    type: String,
    ref: "Warehouse",
    default: "",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  inputDate: {
    type: Date,
    default: Date.now,
  },
  outputDate: {
    type: Date,
    default: null,
  },
  totalExport: {
    type: Number,
  },
  state: {
    type: Number,
    default: 5,
  },
  note: {
    type: String,
    default: "",
  },
  projectCode: {
    type: String,
    defautl: "",
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

warehouseStorageSchema.pre("save", async function (next) {
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

const warehouseStorageModel = mongoose.model(
  "WarehouseStorage",
  warehouseStorageSchema
);

export default warehouseStorageModel;
