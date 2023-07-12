import express from "express";
import FarmProjectServices from "../../controller/farm/farm_project_controller.js";
import auth from "../../middleware/authentication.js";

const FarmProjectRouter = express.Router();

FarmProjectRouter.get(
  "/loglist",
  FarmProjectServices.farmProjectController.getFarmProjectLogList
);

FarmProjectRouter.use(auth);

// add new farm project
FarmProjectRouter.post(
  "/",
  FarmProjectServices.farmProjectController.addFarmProject
);

// get all farm project by user id
FarmProjectRouter.get(
  "/all-by-user/",
  FarmProjectServices.farmProjectController.getAllFarnProjectByUserId
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

// get all farm project
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

// get all farm project by farm id
FarmProjectRouter.get(
  "/all/:farmId",
  FarmProjectServices.farmProjectController.getAllFarmProjectsInFarm
);

export default FarmProjectRouter;
