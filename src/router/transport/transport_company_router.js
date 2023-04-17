import express from "express";
import transportCompanyController from "../../controller/transport/transport_company_controller.js";
import auth from "../../middleware/authentication.js";

const transportCompanyRouter = express.Router();

transportCompanyRouter.use(auth);

transportCompanyRouter.post(
  "/",
  transportCompanyController.addTransportCompany
);

transportCompanyRouter.get(
  "/:id",
  transportCompanyController.getTransportCompany
);

transportCompanyRouter.get(
  "/",
  transportCompanyController.getAllTransportCompany
);

transportCompanyRouter.patch(
  "/:id",
  transportCompanyController.updateTransportCompany
);

transportCompanyRouter.delete(
  "/:id",
  transportCompanyController.deleteTransportCompany
);

export default transportCompanyRouter;
