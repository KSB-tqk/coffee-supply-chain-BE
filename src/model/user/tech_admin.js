import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const TechAdmin = User.discriminator(
  "TechAdmin",
  new mongoose.Schema({ superRole: { type: String } }, options)
);

export default TechAdmin;
