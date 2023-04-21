import mongoose from "mongoose";

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
    default: 1,
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
});

const harvestModel = mongoose.model("Harvest", harvestSchema);

export default harvestModel;
