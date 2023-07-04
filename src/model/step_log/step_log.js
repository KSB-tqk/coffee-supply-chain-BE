import mongoose from "mongoose";
import QRCode from "qrcode";
import { getBlockchainMode, setBlockchainMode } from "../../enum/app_const.js";
import BlockchainMode from "../../enum/blockchain_mode.js";
import {
  createTransaction,
  storeLogOnBlockchain,
} from "../../helper/blockchain_helper.js";

const stepLogSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      default: "",
    },
    modelBeforeChanged: {
      type: String,
      default: null,
    },
    modelAfterChanged: {
      type: String,
      default: null,
    },
    transactionHash: {
      type: String,
      default: null,
    },
    transactionAddress: {
      type: String,
      default: null,
    },
    transactionUrl: {
      type: String,
      default: null,
    },
    transactionQRCodeUri: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Hash the plain text pwd before saving
stepLogSchema.pre("save", async function (next) {
  const transactionUrl = this.transactionUrl;

  if (transactionUrl != null) {
    this.transactionQRCodeUri = await QRCode.toDataURL(transactionUrl);
  }

  next();
});

stepLogSchema.post("save", async function (stepLog) {
  storeLogOnBlockchain(this.transactionHash, stepLog);
});

const StepLogModel = mongoose.model("StepLog", stepLogSchema);
export default StepLogModel;
