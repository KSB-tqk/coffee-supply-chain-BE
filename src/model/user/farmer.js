import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const Farmer = User.discriminator(
  "Farmer",
  new mongoose.Schema(
    {
      farmId: {
        type: String,
        trim: true,
        default: null,
      },
      isOwner: {
        type: Boolean,
        default: false,
      },
    },
    options
  )
);

export default Farmer;
