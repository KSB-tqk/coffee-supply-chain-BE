import mongoose from "mongoose";
import { getStepLogId } from "../../enum/app_const.js";
import { onUpdateProjectNotification } from "../../helper/project/project_data_helper.js";
import StepLogModel from "../step_log/step_log.js";

const projectSchema = mongoose.Schema({
  projectId: {
    type: String,
    trim: true,
    default: "",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },
  projectName: {
    type: String,
    trim: true,
  },
  projectCode: {
    type: String,
    trim: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateCompleted: {
    type: Date,
    required: false,
  },
  harvest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Harvest",
    trim: true,
  },
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
    trim: true,
  },
  warehouseStorage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseStorage",
    trim: true,
  },
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProduceSupervision",
    trim: true,
  },
  projectLogList: [
    {
      projectLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StepLog",
        trim: true,
      },
    },
  ],
  farmProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmProject",
    default: null,
  },
  state: {
    type: Number,
    default: 1,
    required: true,
  },
  backgroundUrl: {
    type: String,
  },
  logId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StepLog",
  },
});

//Hash the plain text pwd before saving
projectSchema.pre("save", async function (next) {
  const modifiedPaths = this.modifiedPaths().toString();

  const stepLogId = this.logId;

  if (stepLogId != null) {
    const stepLog = await StepLogModel.findById(stepLogId);
    console.log("steplog after save", stepLog);
    stepLog.action = "Modified field: " + modifiedPaths;
    await stepLog.save();

    onUpdateProjectNotification(stepLog, modifiedPaths, this);
  }

  next();
});

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
