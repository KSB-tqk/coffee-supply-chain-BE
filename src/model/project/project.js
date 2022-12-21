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
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farm",
    trim: true,
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
    ref: "WareHouseStorage",
    trim: true,
  },
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produce",
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
