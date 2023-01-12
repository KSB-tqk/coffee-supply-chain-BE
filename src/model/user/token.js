import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listToken: [
      {
        token: {
          type: String,
          require: true,
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
