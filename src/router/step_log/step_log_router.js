import express from "express";
import stepLogController from "../../controller/step_log/step_log_controller.js";
import auth from "../../middleware/authentication.js";

const stepLogRouter = express.Router();

stepLogRouter.use(auth);

stepLogRouter.post("/", stepLogController.addStepLog);

stepLogRouter.get("/:id", stepLogController.getStepLog);

stepLogRouter.get("/", stepLogController.getAllStepLogs);

stepLogRouter.patch("/:id", stepLogController.updateStepLog);

stepLogRouter.delete("/:id", stepLogController.deleteStepLog);

export default stepLogRouter;
