import express from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";
import harvestController from "../../controller/harvest/harvest_controller.js";
import auth from "../../middleware/authentication.js";

const harvestRouter = express.Router();

harvestRouter.use(auth);

harvestRouter.post("/", harvestController.addHarvest);

harvestRouter.get("/:id", harvestController.getHarvest);

harvestRouter.get("/", harvestController.getAllHarvests);

harvestRouter.patch("/:id", harvestController.updateHarvest);

harvestRouter.delete("/:id", harvestController.deleteHarvest);

export default harvestRouter;
