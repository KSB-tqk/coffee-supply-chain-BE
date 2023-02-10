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
    default: Date.now,
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
});

const warehouseStorageModel = mongoose.model(
  "WarehouseStorage",
  warehouseStorageSchema
);

export default warehouseStorageModel;
