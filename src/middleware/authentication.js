import User from "../model/user/user.js";
import jwt from "jsonwebtoken";
import TokenModel from "../model/user/token.js";
import { onError } from "../helper/data_helper.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const validToken = await TokenModel.findOne({
      owner: decoded._id,
      "listToken.token": token,
    });

    if (!validToken) {
      return res
        .status(401)
        .send(onError(401, "Unauthorized, please try again."));
    }
    const user = await User.findById(decoded._id);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send(onError(401, "Unauthorized, please try again."));
  }
};

export default auth;
