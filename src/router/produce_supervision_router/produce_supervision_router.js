import express from "express";
import produceSupervisionController from "../../controller/produce_supervision_controller/produce_supervision_controller.js";
import auth from "../../middleware/authentication.js";

const produceSupervisionRouter = express.Router();

produceSupervisionRouter.use(auth);

produceSupervisionRouter.post(
  "/",
  produceSupervisionController.addProduceSupervision
);

produceSupervisionRouter.get(
  "/all-by-user",
  produceSupervisionController.getAllProduceByUserId
);

produceSupervisionRouter.get(
  "/:id",
  produceSupervisionController.getProduceSupervision
);

produceSupervisionRouter.get(
  "/",
  produceSupervisionController.getAllProduceSupervisions
);

produceSupervisionRouter.patch(
  "/add-produce-supervision",
  produceSupervisionController.addProduceSupervisionInspector
);
produceSupervisionRouter.patch(
  "/remove-produce-supervision",
  produceSupervisionController.removeProduceSupervision
);
produceSupervisionRouter.patch(
  "/:id",
  produceSupervisionController.updateProduceSupervision
);

produceSupervisionRouter.delete(
  "/:id",
  produceSupervisionController.deleteProduceSupervision
);

export default produceSupervisionRouter;
