export async function onValidLandInfo(land) {
  if (land.landName == null || land.landName == "")
    return "Land name can not be blank or empty, please try again.";
  if (land.landArea <= 0)
    return "Land area can not be zero or negative, please try again.";
  return null;
}
