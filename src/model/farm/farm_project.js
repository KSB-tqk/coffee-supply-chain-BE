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
    required: true,
    ref: "Land",
    default: null,
  },
  seed: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Seed",
    default: null,
  },
  dateCreated: {
    type: Date,
    required: true,
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
    default: "",
  },
  totalHarvest: {
    type: Number,
    required: true,
    default: 0,
  },
  state: {
    type: Number,
    required: true,
    default: 4,
  },
  note: {
    type: String,
    required: false,
    default: "",
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
