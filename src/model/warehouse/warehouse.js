import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema({
  warehouseName: {
    type: String,
    required: true,
  },
  warehousePhoneNumber: {
    type: String,
  },
  warehouseAddress: {
    type: String,
  },
});

const WarehouseModel = mongoose.model("Warehouse", warehouseSchema);
export default WarehouseModel;
