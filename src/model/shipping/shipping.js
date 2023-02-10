import mongoose from "mongoose";

const shippingSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: "",
  },
  shippingId: {
    type: String,
    trim: true,
    default: "",
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  transport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
    default: "",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "",
  },
  vehicleType: {
    type: String,
    default: "",
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
    default: "",
  },
});

const shippingModel = mongoose.model("Shipping", shippingSchema);

export default shippingModel;
