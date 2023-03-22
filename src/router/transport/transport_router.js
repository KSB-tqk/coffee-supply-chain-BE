import express from "express";
import auth from "../../middleware/authentication.js";
import transportController from "../../controller/transport/transport_controller.js";

const transportRouter = express.Router();

transportRouter.use(auth);

transportRouter.post("/", transportController.addShipping);

transportRouter.get("/:id", transportController.getShipping);

transportRouter.get("/", transportController.getAllShipping);

transportRouter.patch("/:id", transportController.updateShipping);

transportRouter.delete("/:id", transportController.deleteShipping);

export default transportRouter;
