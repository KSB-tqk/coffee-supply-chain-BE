import mongoose from "mongoose";
import QRcode from "qrcode";

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

  state: {
    type: Number,
    default: 0,
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

  productQRCodeUri: {
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

//Hash the plain text pwd before saving
productSchema.pre("save", async function (next) {
  const state = this.state;

  if (state == 1) {
    this.productQRCodeUri = await QRcode.toDataURL(this.productId);
  } else this.productQRCodeUri = null;

  next();
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
