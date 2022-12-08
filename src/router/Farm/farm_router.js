import express from "express";
import FarmServices from "../../controller/Farm/farm_controller.js";
import auth from "../../middleware/authentication.js";

const farmRouter = express.Router();

/* -----------Seed----------- */
// add new seed
farmRouter.post("/seed/", FarmServices.seedController.addSeed);

// update seed
farmRouter.patch("/seed/:id", FarmServices.seedController.updateSeed);

// delete seed
farmRouter.delete("/seed/:id", FarmServices.seedController.deleteSeed);

// get all seed by farm ID
farmRouter.get("/seed/all/:id", FarmServices.seedController.getAllSeeds);

// get detail seed
farmRouter.get("/seed/:id", FarmServices.seedController.getSeed);

/* -----------Land----------- */
// add new land
farmRouter.post("/land/", FarmServices.landController.addLand);

// update land
farmRouter.patch("/land/:id", FarmServices.landController.updateLand);

// delete land
farmRouter.delete("/land/:id", FarmServices.landController.deleteLand);

// get all land by farm ID
farmRouter.get("/land/all/:id", FarmServices.landController.getAllLands);

// get detail land
farmRouter.get("/land/:id", FarmServices.landController.getLand);

/* -----------Farm----------- */
// add farm
farmRouter.post("/", FarmServices.farmController.addFarm);

// update farm
farmRouter.patch("/:id", FarmServices.farmController.updateFarm);

// get detail farm
farmRouter.get("/:id", FarmServices.farmController.getFarm);

// get all farm
farmRouter.get("/", FarmServices.farmController.getAllFarms);

// delete farm by id
farmRouter.delete("/:id", FarmServices.farmController.deleteFarms);

export default farmRouter;
