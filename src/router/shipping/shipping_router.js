import express from "express";
import auth from "../../middleware/authentication.js";
import shippingController from "../../controller/shipping/shipping_controller.js";

const shippingRouter = express.Router();

shippingRouter.use(auth);

shippingRouter.post("/", shippingController.addShipping);

shippingRouter.get("/:id", shippingController.getShipping);

shippingRouter.get("/", shippingController.getAllShipping);

shippingRouter.patch("/:id", shippingController.updateShipping);

shippingRouter.delete("/:id", shippingController.deleteShipping);

export default shippingRouter;
