import mongoose from "mongoose";

const harvestSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
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
    required: true,
  },
  dateCompleted: {
    type: Date,
    required: true,
    default: Date.now,
  },
  state: {
    type: Number,
    required: true,
    default: 1,
  },
});

const harvestModel = mongoose.model("Harvest", harvestSchema);

export default harvestModel;
