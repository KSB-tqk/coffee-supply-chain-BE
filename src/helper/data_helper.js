import Web3 from "web3";
import User from "../model/user/user.js";

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
