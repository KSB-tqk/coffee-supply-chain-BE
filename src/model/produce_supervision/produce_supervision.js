import mongoose from "mongoose";

const produceSupervisionSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Factory",
    default: null,
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  dateCompleted: {
    type: Date,
    default: Date.now,
  },
  totalProduct: {
    type: Number,
    default: 0,
  },
  humidity: {
    type: Number,
    default: 0,
  },
  dryingTemperature: {
    type: Number,
    default: 0,
  },
  expireDate: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: Number,
    default: 1,
  },
  note: {
    type: String,
    default: null,
  },
});

const ProduceSupervisionModel = mongoose.model(
  "ProduceSupervision",
  produceSupervisionSchema
);
export default ProduceSupervisionModel;
