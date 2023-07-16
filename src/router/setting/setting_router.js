import express from "express";
import settingController from "../../controller/setting/setting_controller.js";
import auth from "../../middleware/authentication.js";

const settingRouter = express.Router();

settingRouter.get("/get", settingController.getTransactionHash);

settingRouter.use(auth);

settingRouter.get(
  "/change-blockchain-mode",
  settingController.changeBlockChainMode
);

settingRouter.get(
  "/blockchain-mode",
  settingController.getCurrentBlockchainMode
);

export default settingRouter;
