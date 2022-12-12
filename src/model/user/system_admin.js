import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const SystemAdmin = User.discriminator(
  "SystemAdmin",
  new mongoose.Schema({ superRole: { type: String } }, options)
);

export default SystemAdmin;
