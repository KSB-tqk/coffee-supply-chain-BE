import { BASE_TRANSACTION_URL, ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  findDuplicates,
  getUserIdByHeader,
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import ProductModel from "../../model/product/product.js";
const productController = {
  addProduct: async (req, res) => {
    try {
      const product = new ProductModel(req.body);

      product.productId = product._id;
      await product.save();

      res
        .status(200)
        .send({ msg: "Create product successfully", product: product });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  updateProduct: async (req, res) => {
    const id = req.params.id;

    const product = await ProductModel.findById(id).exec();

    if (!product) {
      return res.status(400).send(onError(400, "This product doesn't exist"));
    }

    ProductModel.findOne({ _id: id }, async function (err, product) {
      if (err) {
        res
          .status(422)
          .send(onError(422, "Update product failed" + ERROR_MESSAGE));
      } else {
        const oldState = product.state;

        for (var field in ProductModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              product[field] = req.body[field];
              console.log("product update field: ", product[field]);
            }
          }
        }

        await product.save();
        const productPop = await ProductModel.findById(product._id);

        res.status(200).send({
          product: productPop,
        });
      }
    });
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;

      const product = await ProductModel.findById(id).exec();

      if (!product) {
        return res.status(400).send(onError(400, "This product doesn't exist"));
      }

      await ProductModel.findByIdAndDelete(id);
      res.status(200).send({ msg: "Delete product success" });
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const product = await ProductModel.find();

      res.status(200).send(product.reverse());
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await ProductModel.findById(id)
        .populate("projectId")
        .exec();

      if (!product) {
        return res.status(400).send(onError(400, "This product doesn't exist"));
      }

      res.status(200).send(product);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },

  getProductWithoutToken: async (req, res) => {
    try {
      const id = req.query.productId;
      const product = await ProductModel.findById(id)
        .populate("projectId")
        .exec();

      if (!product) {
        return res.status(400).send(onError(400, "This product doesn't exist"));
      }

      res.status(200).send(product);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
};

export default productController;
