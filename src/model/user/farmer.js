import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const Farmer = User.discriminator(
  "Farmer",
  new mongoose.Schema(
    {
      farmList: [
        { farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm" } },
      ],
    },
    options
  )
);

export default Farmer;
