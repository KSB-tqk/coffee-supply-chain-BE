import express from "express";
import auth from "../../middleware/authentication.js";
import warehouseController from "../../controller/warehouse/warehouse_controller.js";

const warehouseRouter = express.Router();

warehouseRouter.use(auth);

warehouseRouter.post("/", warehouseController.addWarehouse);

warehouseRouter.get("/:id", warehouseController.getWarehouse);

warehouseRouter.get("/", warehouseController.getAllWarehouses);

warehouseRouter.patch("/:id", warehouseController.updateWarehouse);

warehouseRouter.delete("/:id", warehouseController.deleteWarehouse);

export default warehouseRouter;
