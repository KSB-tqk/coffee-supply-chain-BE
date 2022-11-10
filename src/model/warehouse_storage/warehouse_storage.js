import mongoose from "mongoose";

const warehouseStorageSchema = mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  totalInput: {
    type: Number,
    default: 0,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  },
});

const warehouseStorageModel = mongoose.model(
  "WarehouseStorage",
  warehouseStorageSchema
);

export default warehouseStorageModel;
