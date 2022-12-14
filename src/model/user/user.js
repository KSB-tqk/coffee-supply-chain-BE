import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import extendSchema from "mongoose-extend-schema";
import { checkValidObjectId } from "../../helper/data_helper.js";
import TokenModel from "./token.js";

const options = { discriminatorKey: "kind" };

const userSchema = mongoose.Schema(
  {
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: 1,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Invalid Email");
        }
      },
    },
    address: {
      type: String,
    },
    department: {
      type: Number,
      default: 1,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw Error("Invalid password");
        } else if (value.includes("password")) {
          throw Error('Password cannot contain keyword "Password"');
        }
      },
    },
    walletAddress: {
      type: String,
      trim: true,
      unique: true,
    },
    tokenAddress: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
  options
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  const isTokenExist = await TokenModel.exists({ owner: user._id });
  if (isTokenExist) {
    const tokenModel = TokenModel.findOne({ owner: user._id });
    if (tokenModel.listToken == null) tokenModel.listToken = [];
    tokenModel.listToken = tokenModel.listToken.concat({ token });
  } else {
    const tokenModel = new TokenModel({ owner: user._id });
    tokenModel.listToken = tokenModel.listToken.concat({ token });
    tokenModel.save();
  }

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw Error(
      "Unable to find account link to this email, please check and try again"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw Error("Unable to login, Please check your password, then try again.");
  }

  return user;
};

//Hash the plain text pwd before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
