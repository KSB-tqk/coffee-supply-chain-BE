import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const farmProjectSchema = mongoose.Schema({
  farmProjectId: {
    type: String,
    default: null,
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    default: null,
  },
  farmProjectCode: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  enterprise: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    trim: true,
  },
  land: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Land",
    default: null,
  },
  seed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seed",
    default: null,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateHarvested: {
    type: Date,
    required: false,
    default: null,
  },
  fertilizerUsed: {
    type: String,
    required: false,
    default: null,
  },
  totalHarvest: {
    type: Number,
    required: false,
    default: null,
  },
  state: {
    type: Number,
    default: 4,
  },
  note: {
    type: String,
    required: false,
    default: null,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  logId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StepLog",
  },
  totalSeeds: {
    type: Number,
    default: 0.0,
  },
  totalFertilizers: {
    type: Number,
    default: 0.0,
  },
  ripeness: {
    type: Number,
    default: 0.0,
  },
  pesticide: {
    type: String,
  },
  plantDensity: {
    type: Number,
    default: 0.0,
  },
});

//Hash the plain text pwd before saving
farmProjectSchema.pre("save", async function (next) {
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

const FarmProjectModel = mongoose.model("FarmProject", farmProjectSchema);

export default FarmProjectModel;
