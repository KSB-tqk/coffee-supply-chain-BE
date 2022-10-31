import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      required: true,
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
    enterpriseOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enterprise",
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.pwd;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, pwd) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw Error(
      "Unable to login, Please check your email and password, then try again."
    );
  }

  const isMatch = await bcrypt.compare(pwd, user.pwd);

  if (!isMatch) {
    throw Error(
      "Unable to login, Please check your email and password, then try again."
    );
  }

  return user;
};

//Hash the plain text pwd before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("pwd")) {
    user.pwd = await bcrypt.hash(user.pwd, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
