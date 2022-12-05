const mongoose = require("mongoose");
const extendSchema = require("mongoose-extend-schema");
import UserSchema from "../../model/user/user.js";

const systemAdminSchema = extendSchema(UserSchema, {
  isAdmin: { type: Boolean },
});

const systemAdminModel = mongoose.model("User", systemAdminSchema);

export default systemAdminModel;
