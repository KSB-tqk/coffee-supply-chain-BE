import mongoose from "mongoose";

const produceSupervisionSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  produceSupervisionId: {
    type: String,
    default: null,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  factory: {
    type: String,
    ref: "Factory",
    default: "",
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
  expiredDate: {
    type: Date,
    default: null,
  },
  state: {
    type: Number,
    default: 1,
  },
  note: {
    type: String,
    default: null,
  },
  projectCode: {
    type: String,
    default: "",
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

const ProduceSupervisionModel = mongoose.model(
  "ProduceSupervision",
  produceSupervisionSchema
);
export default ProduceSupervisionModel;
