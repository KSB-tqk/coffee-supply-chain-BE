import mongoose, { mongo } from "mongoose";

const farmSchema = mongoose.Schema({
  farmId: {
    type: String,
    required: true,
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
    required: true,
    ref: "User",
    default: null,
  },
  seeds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seed",
    },
  ],
  lands: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Land",
    },
  ],
  farmProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmProject",
    },
  ],
  dateCreate: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: Number,
    default: 4,
  },
});

const FarmModel = mongoose.model("Farm", farmSchema);

export default FarmModel;
