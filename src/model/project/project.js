import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  farmProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmProject",
    trim: true,
  },
  harvest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Harvest",
    trim: true,
  },
  shipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipping",
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
  state: {
    type: Number,
    default: 1,
    required: true,
  },
});

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
