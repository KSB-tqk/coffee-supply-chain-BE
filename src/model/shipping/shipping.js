import mongoose from "mongoose";

const shippingSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
    required: true,
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
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
  },
});

const shippingModel = mongoose.model("Shipping", shippingSchema);

export default shippingModel;
