import express from "express";
import FarmServices from "../../controller/farm/farm_controller.js";
import SeedService from "../../controller/farm/seed_controller.js";
import LandService from "../../controller/farm/land_controllers.js";
import auth from "../../middleware/authentication.js";

const farmRouter = express.Router();

farmRouter.use(auth);

//
//
//-----------------------
//----------Seed---------
/* ---------------------- */
// add new seed
farmRouter.post("/seed/", SeedService.seedController.addSeed);

// update seed
farmRouter.patch("/seed/:id", SeedService.seedController.updateSeed);

// delete seed
farmRouter.delete("/seed/:id", SeedService.seedController.deleteSeed);

// get all seed
farmRouter.get("/seed/all/", SeedService.seedController.getAllSeeds);

// get detail seed
farmRouter.get("/seed/:id", SeedService.seedController.getSeed);

// get all seeds by Farm ID
farmRouter.get(
  "/seed/all/:farmId",
  SeedService.seedController.getAllSeedsInFarm
);

//
//
//-----------------------
//----------Land---------
/* ---------------------- */
// add new land
farmRouter.post("/land/", LandService.landController.addLand);

// update land
farmRouter.patch("/land/:id", LandService.landController.updateLand);

// delete land
farmRouter.delete("/land/:id", LandService.landController.deleteLand);

// get all land
farmRouter.get("/land/all/", LandService.landController.getAllLands);

// get detail land
farmRouter.get("/land/:id", LandService.landController.getLand);

// get all lands by farm ID
farmRouter.get(
  "/land/all/:farmId",
  LandService.landController.getAllLandsInFarm
);

//
//
//-----------------------
//----------Farm---------
/* ---------------------- */
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

// add farmer into farm
farmRouter.post(
  "/add-farmer/:id",
  FarmServices.farmController.addFarmerIntoFarm
);

//-----------------------
//--------FarmSeed-------

// remove seed from farm
farmRouter.delete(
  "/:id/remove-seed/",
  FarmServices.farmController.removeSeedFromFarm
);

//-----------------------
//--------FarmLand-------

// remove land from farm
farmRouter.delete(
  "/:id/remove-land/",
  FarmServices.farmController.removeLandFromFarm
);

//-----------------------
//-------FarmProject-----

// remove farm project from farm
farmRouter.delete(
  "/:id/remove-farmproject/",
  FarmServices.farmController.removeFarmProjectFromFarm
);

// remove farmer from farm
farmRouter.post(
  "/remove-farmer/:id",
  FarmServices.farmController.removeFarmerFromFarm
);

// get all lands by farm ID
farmRouter.get(
  "/farmProject/all/:farmId",
  FarmServices.farmController.getAllFarmProjectInFarm
);
export default farmRouter;
