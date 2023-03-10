import mongoose from "mongoose";

const enterpriseSchema = mongoose.Schema(
  {
    enterpriseName: {
      type: String,
      trim: true,
    },
    enterpriseAvatar: {
      type: String,
      trim: true,
    },
    enterpriseEmployeeCount: {
      type: Number,
      default: 0,
      validator(value) {
        if (value < 0) {
          throw Error("Invalid number of employee");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

enterpriseSchema.virtual("employees", {
  ref: "User",
  localField: "_id",
  foreignField: "enterpriseOwner",
});

const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

export default Enterprise;
