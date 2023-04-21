import mongoose from "mongoose";

const transportSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  projectCode: {
    type: String,
    default: "",
  },
  transportId: {
    type: String,
    trim: true,
    default: "",
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  transportCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransportCompany",
    default: null,
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  vehicle: {
    type: String,
    default: "",
  },
  numberOfVehicle: {
    type: Number,
    default: 0,
  },
  dateCompleted: {
    type: Date,
    default: null,
  },
  dateExpected: {
    type: Date,
    default: null,
  },
  state: {
    type: Number,
    default: 1,
  },
  note: [String],
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

const transportModel = mongoose.model("Transport", transportSchema);

export default transportModel;
