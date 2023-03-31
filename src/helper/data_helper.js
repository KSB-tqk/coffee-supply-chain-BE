import Web3 from "web3";
import PermissionModel from "../model/permission/permission.js";
import User from "../model/user/user.js";
import jwt from "jsonwebtoken";

// Validate object id
export function checkValidObjectId(objectId) {
  if (objectId.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else return false;
}

//
//  Validate data and permission for user
//
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

// Check valid user role from bearer token
export async function onValidUserRole(bearerHeader, role) {
  const token = await getTokenFromBearerTokenHeader(bearerHeader);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decoded._id });
  if (user != null) {
    for (let i = 0; i < role.length; i++) {
      if (role[i] == user.role) return user;
    }
  }
  return false;
}

// Compare userid with token
export async function compareUserIdWithToken(bearerHeader, userId) {
  const token = await getTokenFromBearerTokenHeader(bearerHeader);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded._id == userId;
}

// Logout current user
export async function onLogoutCurrentUser(bearerHeader) {
  const token = await getTokenFromBearerTokenHeader(bearerHeader);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const result = await PermissionModel.findOne({
    owner: decoded._id,
    "listToken.token": token,
  });
  result.listToken = [];
  result.save();
  return result;
}

// Check User Exist from Id
export async function onValidUserId(userId) {
  return await User.findById(userId);
}

// Check User Exist from Email
export async function onValidUserEmail(userEmail) {
  return await User.findOne({
    email: userEmail,
  });
}
// ----- End User data validator -----

// On Response
export function onResponse(didError, errorMessage, model) {
  if (typeof model === "undefined") model = null;
  if (typeof didError === "undefined") didError = null;
  if (typeof errorMessage === "undefined") errorMessage = null;
  return JSON.parse(
    `{"didError": "${didError}", "errorMessage": "${errorMessage}", "model": "${model}" }`
  );
}

// On Request Error
export function onError(errorCode, errorMessage) {
  return JSON.parse(
    `{ "code": ${errorCode}, "message": "${errorMessage}", "isError": ${true} }`
  );
}

// Export Bearer Token from Request
async function getTokenFromBearerTokenHeader(header) {
  const result = header.replace("Bearer ", "");
  return result;
}

// Export User Id By Token
export async function getUserIdByHeader(header) {
  const token = await getTokenFromBearerTokenHeader(header);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded._id;
}
