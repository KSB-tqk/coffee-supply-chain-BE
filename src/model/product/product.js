import mongoose from "mongoose";
import StepLogModel from "../step_log/step_log.js";

const productSchema = mongoose.Schema({
  productId: {
    type: String,
    trim: true,
  },
  productName: {
    type: String,
  },

  description: [
    {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],

  exp: {
    type: String,
  },
  mfg: {
    type: String,
  },

  bussinessLicenseRegistrationNumber: {
    type: String,
  },

  certificateOfFoodHygieneAndSafety: {
    type: String,
  },

  productCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
  },

  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
