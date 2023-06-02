import express from "express";
import dashBoardController from "../../controller/dash_board/dash_board_controller.js";
import auth from "../../middleware/authentication.js";

const dashBoardRouter = express.Router();

dashBoardRouter.use(auth);

// get dashboard info for tech admin
dashBoardRouter.get("/", dashBoardController.getDefaultInfo);

// get dashboard info for system admin
dashBoardRouter.get(
  "/system-admin",
  dashBoardController.getSystemAdminDashBoardInfo
);

// get list project per month
dashBoardRouter.get(
  "/project-per-month",
  dashBoardController.getProjectPerMonth
);

// get dashboard info for farmer
dashBoardRouter.get("/farmer", dashBoardController.getDefaultInfo);

export default dashBoardRouter;
