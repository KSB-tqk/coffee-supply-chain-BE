import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const TechAdmin = User.discriminator(
  "TechAdmin",
  new mongoose.Schema(
    { isTechAdmin: { type: Boolean, default: true } },
    options
  )
);

export default TechAdmin;
