import express from "express";
import Enterprise from "../../model/enterprise.js";
import auth from "../../middleware/authentication.js";
import enterpriseController from "../../controller/enterprise/enterprise_controller.js";

const enterpriseRouter = express.Router();

enterpriseRouter.post("/", enterpriseController.addEnterprise);

enterpriseRouter.get("/:id", enterpriseController.getEnterprise);

enterpriseRouter.get("/", enterpriseController.getAllEnterprises);

enterpriseRouter.patch("/:id", enterpriseController.updateEnterprise);

enterpriseRouter.delete("/:id", enterpriseController.deleteEnterprise);

export default enterpriseRouter;
