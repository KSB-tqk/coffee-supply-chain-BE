import mongoose from "mongoose";

const warehouseStorageSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  warehouseStorageId: {
    type: String,
    default: null,
  },
  warehouse: {
    type: String,
    ref: "Warehouse",
    default: "",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  inputDate: {
    type: Date,
    default: Date.now,
  },
  outputDate: {
    type: Date,
    default: null,
  },
  totalExport: {
    type: Number,
    default: 0,
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
    defautl: "",
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

const warehouseStorageModel = mongoose.model(
  "WarehouseStorage",
  warehouseStorageSchema
);

export default warehouseStorageModel;
