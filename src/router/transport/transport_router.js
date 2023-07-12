import express from "express";
import auth from "../../middleware/authentication.js";
import transportController from "../../controller/transport/transport_controller.js";

const transportRouter = express.Router();

transportRouter.get("/loglist", transportController.getTransportLogList);

transportRouter.use(auth);

transportRouter.post("/", transportController.addTransport);

transportRouter.get("/", transportController.getAllTransport);

transportRouter.get(
  "/all-by-user",
  transportController.getAllTransportByUserId
);

transportRouter.get("/:id", transportController.getTransport);

transportRouter.patch(
  "/add-transport-supervision",
  transportController.addTransportSupervision
);

transportRouter.patch(
  "/remove-transport-supervision",
  transportController.removeTransportSupervision
);

transportRouter.patch("/:id", transportController.updateTransport);

transportRouter.delete("/:id", transportController.deleteTransport);

export default transportRouter;
