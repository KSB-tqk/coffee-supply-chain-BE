import mongoose from "mongoose";
import User from "./user.js";

const options = { discriminatorKey: "kind" };

const Staff = User.discriminator(
  "Staff",
  new mongoose.Schema(
    {
      isStaff: {
        type: Boolean,
        default: true,
      },
    },
    options
  )
);

export default Staff;
