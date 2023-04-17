import express from "express";
import factoryController from "../../controller/produce_supervision_controller/factory_controller.js";

import auth from "../../middleware/authentication.js";

const factoryRouter = express.Router();

factoryRouter.use(auth);

factoryRouter.post("/", factoryController.addFactory);

factoryRouter.get("/:id", factoryController.getFactory);

factoryRouter.get("/", factoryController.getAllFactory);

factoryRouter.patch("/:id", factoryController.updateFactory);

factoryRouter.delete("/:id", factoryController.deleteFactory);

export default factoryRouter;
