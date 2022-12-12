export function checkValidObjectId(objectId) {
  if (objectId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log(objectId.toString() + " Is valid");
    return true;
  } else return false;
}
