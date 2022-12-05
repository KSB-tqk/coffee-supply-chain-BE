import mongoose from "mongoose";

const produceSupervisionSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  totalInput: {
    type: Number,
  },
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Factory",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  },
});

const ProduceSupervisionModel = mongoose.model(
  "ProduceSupervision",
  produceSupervisionSchema
);
export default ProduceSupervisionModel;
