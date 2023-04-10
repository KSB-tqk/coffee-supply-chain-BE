import mongoose from "mongoose";

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
});

const FarmProjectModel = mongoose.model("FarmProject", farmProjectSchema);

export default FarmProjectModel;
