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
