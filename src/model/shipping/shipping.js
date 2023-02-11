import mongoose from "mongoose";

const shippingSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
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
    type: String,
    ref: "Transport",
    default: "",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  vehicleType: {
    type: String,
    default: "",
  },
  numberOfVehicle: {
    type: Number,
    default: 0,
  },
  dateInput: {
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
  projectCode: {
    type: String,
    default: "",
  },
});

const shippingModel = mongoose.model("Shipping", shippingSchema);

export default shippingModel;
