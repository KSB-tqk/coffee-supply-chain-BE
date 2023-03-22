import express from "express";
import auth from "../../middleware/authentication.js";
import transportDriverController from "../../controller/transport/transport_driver_controller.js";

const transportDriverRouter = express.Router();

transportDriverRouter.use(auth);

transportDriverRouter.post("/", transportDriverController.addTransport);

transportDriverRouter.get("/:id", transportDriverController.getTransport);

transportDriverRouter.get("/", transportDriverController.getAllTransports);

transportDriverRouter.patch("/:id", transportDriverController.updateTransport);

transportDriverRouter.delete("/:id", transportDriverController.deleteTransport);

export default transportDriverRouter;
