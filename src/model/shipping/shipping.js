import mongoose from "mongoose";

const shippingSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
    default: null,
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  vehicleType: {
    type: String,
    default: null,
  },
  numberOfVehicle: {
    type: Number,
    default: 0,
  },
  dateExpected: {
    type: Date,
    required: true,
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

const shippingModel = mongoose.model("Shipping", shippingSchema);

export default shippingModel;
