import express from "express";
import harvestController from "../../controller/harvest/harvest_controller.js";
import auth from "../../middleware/authentication.js";

const harvestRouter = express.Router();

harvestRouter.use(auth);

harvestRouter.post("/", harvestController.addHarvest);

harvestRouter.patch("/add-harvestor", harvestController.addHarvestor);

harvestRouter.patch("/remove-harvestor", harvestController.removeHarvestor);

harvestRouter.get("/all-by-user", harvestController.getAllHarvestByUserId);

harvestRouter.get("/:id", harvestController.getHarvest);

harvestRouter.get("/", harvestController.getAllHarvests);

harvestRouter.patch("/:id", harvestController.updateHarvest);

harvestRouter.delete("/:id", harvestController.deleteHarvest);

export default harvestRouter;
