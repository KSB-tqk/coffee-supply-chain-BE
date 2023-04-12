import mongoose, { mongo } from "mongoose";

const farmSchema = mongoose.Schema({
  farmId: {
    type: String,
    trim: true,
    default: null,
  },
  farmCode: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  statusFarm: {
    type: Number,
    required: true,
    default: 2,
  },
  farmName: {
    type: String,
    trim: true,
    requiredt: true,
    default: "",
  },
  farmAddress: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  farmPhoneNumber: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  farmOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  farmerList: [
    {
      farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  seedList: [
    {
      seed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seed",
      },
    },
  ],
  landList: [
    {
      land: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land",
      },
    },
  ],
  farmProjectList: [
    {
      farmProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FarmProject",
      },
    },
  ],
  dateCreate: {
    type: Date,
    default: Date.now,
  },
});

const FarmModel = mongoose.model("Farm", farmSchema);

export default FarmModel;
