import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    otpCode: {
      type: String,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;
