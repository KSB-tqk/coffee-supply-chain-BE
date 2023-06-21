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

  projectId: {
    type: String,
    ref: "Project",
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

  businessLicenseRegistrationNumber: {
    type: String,
  },

  certificateOfFoodHygieneAndSafety: {
    type: String,
  },

  productCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enterprise",
  },

  typeOfProduct: {
    type: String,
  },

  measureUnit: {
    type: String,
  },

  productImage: [
    {
      productImageUrl: {
        type: String,
      },
    },
  ],
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
