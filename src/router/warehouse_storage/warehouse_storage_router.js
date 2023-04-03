import express from "express";
import warehouseStorageController from "../../controller/warehouse_storage/warehouse_storage_controller.js";
import auth from "../../middleware/authentication.js";

const warehouseStorageRouter = express.Router();

warehouseStorageRouter.use(auth);

warehouseStorageRouter.post(
  "/",
  warehouseStorageController.addWarehouseStorage
);

warehouseStorageRouter.patch(
  "/add-warehouse-supervision",
  warehouseStorageController.addWarehouseStorageSupervision
);

warehouseStorageRouter.patch(
  "/remove-warehouse-supervision",
  warehouseStorageController.removeWarehouseStorageSupervision
);

warehouseStorageRouter.get(
  "/:id",
  warehouseStorageController.getWarehouseStorage
);

warehouseStorageRouter.get(
  "/",
  warehouseStorageController.getAllWarehouseStorages
);

warehouseStorageRouter.patch(
  "/:id",
  warehouseStorageController.updateWarehouseStorage
);

warehouseStorageRouter.delete(
  "/:id",
  warehouseStorageController.deleteWarehouseStorage
);

export default warehouseStorageRouter;
