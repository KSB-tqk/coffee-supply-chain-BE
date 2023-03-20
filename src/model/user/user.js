import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import extendSchema from "mongoose-extend-schema";
import { checkValidObjectId } from "../../helper/data_helper.js";
import PermissionModel from "../permission/permission.js";

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
    phoneNumber: {
      type: String,
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

  const isTokenExist = await PermissionModel.exists({ owner: user._id });
  if (isTokenExist) {
    const tokenModel = await PermissionModel.findOne({ owner: user._id });
    tokenModel.listToken = [];
    tokenModel.listToken = tokenModel.listToken.concat({ token });
    await tokenModel.save();
    if (tokenModel.listToken == null) tokenModel.listToken = [];
    tokenModel.listToken = tokenModel.listToken.concat({ token });
  } else {
    const tokenModel = new PermissionModel({ owner: user._id });
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
    throw Error("Wrong password or email, Please check and try again.");
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
