import express from "express";
import productController from "../../controller/project/product_controller.js";
import auth from "../../middleware/authentication.js";

const productRouter = express.Router();

productRouter.use(auth);

productRouter.post("/", productController.addProduct);

productRouter.get("/:id", productController.getProduct);

productRouter.get("/", productController.getAllProducts);

productRouter.patch("/:id", productController.updateProduct);

productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
