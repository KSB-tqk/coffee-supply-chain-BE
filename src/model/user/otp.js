import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  otpCode: {
    type: String,
  },
});

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;
