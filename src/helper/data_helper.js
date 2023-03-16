import Web3 from "web3";
import PermissionModel from "../model/permission/permission.js";
import User from "../model/user/user.js";
import jwt from "jsonwebtoken";

export function checkValidObjectId(objectId) {
  if (objectId.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else return false;
}

export async function checkValidAdminAccess(userId) {
  if (!checkValidObjectId(userId)) {
    return "Invalid Id";
  }

  const user = await User.findById(userId);

  if (!user) {
    return "Not Found";
  } else if (user.role == 1) {
    return null;
  }

  return "Unauthorized User";
}

export async function checkFarmer(userId) {
  const user = await User.findById(userId);

  if (user.role != 3) {
    return false;
  } else return true;
}

export async function checkValidUserInfo(user) {
  const userInfo = await User.find({ email: user.email });
  console.log("User Info ", userInfo.length);
  const validWalletAddress = Web3.utils.isAddress(user.walletAddress);
  console.log("Valid Wallet Address", validWalletAddress);
  if (userInfo.length > 0) {
    return "The email already linked to another account, please try again.";
  }
  if (!validWalletAddress) {
    return "Invalid metamask wallet address, please try again.";
  }
  if (
    !user.lastName ||
    !user.firstName ||
    !user.role ||
    !user.email ||
    !user.department ||
    !user.password ||
    !user.walletAddress
  ) {
    return "Invalid user information, please try again";
  }

  return null;
}

export function onError(errorCode, errorMessage) {
  return JSON.parse(
    `{ "code": ${errorCode}, "message": "${errorMessage}", "isError": ${true} }`
  );
}

export async function onValidUserRole(token, role) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded._id });
  return user != null && user.role == role;
}

export async function compareUserIdWithToken(token, userId) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded._id == userId;
}

export async function onLogoutCurrentUser(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const result = await PermissionModel.findOne({
    owner: decoded._id,
    "listToken.token": token,
  });
  result.listToken = [];
  result.save();
  return result;
}
