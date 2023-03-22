import express from "express";
import FarmProjectServices from "../../controller/farm/farm_project_controller.js";
import auth from "../../middleware/authentication.js";

const FarmProjectRouter = express.Router();

FarmProjectRouter.use(auth);

// add new farm project
FarmProjectRouter.post(
  "/",
  FarmProjectServices.farmProjectController.addFarmProject
);

// update farm project
FarmProjectRouter.patch(
  "/:id",
  FarmProjectServices.farmProjectController.updateFarmProject
);

// delete farm project
FarmProjectRouter.delete(
  "/:id",
  FarmProjectServices.farmProjectController.deleteFarmProject
);

// get all farm project by FarmId
FarmProjectRouter.get(
  "/all",
  FarmProjectServices.farmProjectController.getAllFarmProjects
);

// get all farm project that are non-farm
FarmProjectRouter.get(
  "/non-farm",
  FarmProjectServices.farmProjectController.getAllNonFarmAssignFarmProject
);

// get detail farm project
FarmProjectRouter.get(
  "/:id",
  FarmProjectServices.farmProjectController.getFarmProject
);

export default FarmProjectRouter;
