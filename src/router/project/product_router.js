import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import productController from "../../controller/project/product_controller.js";
import auth from "../../middleware/authentication.js";

const productRouter = express.Router();

productRouter.get("/without-token", productController.getProductWithoutToken);

productRouter.use(auth);

productRouter.post(
  "/",
  upload.array("productImage", 4),
  productController.addProduct
);

productRouter.get("/all", productController.getAllProductByState);

productRouter.get(
  "/all-by-project",
  productController.getAllProductByProjectId
);
productRouter.get("/:id", productController.getProduct);

productRouter.get("/", productController.getAllProducts);

productRouter.patch("/:id", productController.updateProduct);

productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
