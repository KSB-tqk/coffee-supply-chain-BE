import express from "express";
import auth from "../../middleware/authentication.js";
import transportController from "../../controller/shipping/transport_controller.js";

const transportRouter = express.Router();

transportRouter.use(auth);

transportRouter.post("/", transportController.addTransport);

transportRouter.get("/:id", transportController.getTransport);

transportRouter.get("/", transportController.getAllTransports);

transportRouter.patch("/:id", transportController.updateTransport);

transportRouter.delete("/:id", transportController.deleteTransport);

export default transportRouter;
