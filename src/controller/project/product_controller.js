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
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { promisify } from "util";
import { dirname } from "path";
import fs from "fs";
import ImageUploadModel from "../../model/image_upload/image_upload.js";
import ProductModel from "../../model/product/product.js";

dotenv.config({ path: path.resolve(dirname + "/dev.env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productController = {
  addProduct: async (req, res) => {
    try {
      const product = new ProductModel(req.body);

      product.productId = product._id;

      if (product.productImage == null) product.productImage = [];

      if (req.body.productImage != null)
        for (const file of req.body.productImage) {
          product.productImage = product.productImage.concat({
            productImageUrl: file,
          });
        }

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

    if (
      (await onValidUserRole(req.header("Authorization"), [
        UserRole.TechAdmin,
        UserRole.SystemAdmin,
      ])) == false
    ) {
      return res
        .status(400)
        .send(
          onError(
            400,
            "Does not have permission to update product state" + ERROR_MESSAGE
          )
        );
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
        .populate({
          path: "projectId",
          populate: {
            path: "produce",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "farmProject",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "harvest",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "transport",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "warehouseStorage",
          },
        })
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
        .populate({
          path: "projectId",
          populate: {
            path: "produce",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "farmProject",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "harvest",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "transport",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "warehouseStorage",
          },
        })
        .populate({
          path: "projectId",
          populate: {
            path: "manager",
          },
        })
        .exec();

      if (!product) {
        return res.status(400).send(onError(400, "This product doesn't exist"));
      }

      res.status(200).send(product);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },

  getAllProductByProjectId: async (req, res) => {
    try {
      const allProduct = await ProductModel.find({
        projectId: req.query.projectId,
      });

      if (allProduct == null) {
        return res
          .status(404)
          .send(onError(404, "No Product Was Found" + ERROR_MESSAGE));
      }

      res.send(allProduct);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },

  getAllProductByState: async (req, res) => {
    try {
      const allProduct = await ProductModel.find({
        state: req.query.state,
      });

      if (allProduct == null) {
        return res
          .status(404)
          .send(onError(404, "No Product Was Found" + ERROR_MESSAGE));
      }

      res.send(allProduct);
    } catch (err) {
      res.status(400).send(onError(err.message));
    }
  },
};

export default productController;
