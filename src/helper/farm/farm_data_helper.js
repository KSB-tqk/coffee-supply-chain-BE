import LandModel from "../../model/Farm/land.js";
import SeedModel from "../../model/Farm/seed.js";

export async function onValidFarmProjectInfo(farmProject) {
  const land = await LandModel.findOne({ _id: farmProject.land });
  console.log("land", land);
  if (land == null) return "Land does not exist, please try again.";
  const seed = await SeedModel.findOne({ _id: farmProject.seed });
  console.log("seed", seed);
  if (seed == null) return "Seed does not exist, please try again.";

  if (farmProject.farmProjectName == null || farmProject.farmProjectName == "")
    return "Farm Project Name can not be blank or empty, please try again.";
  if (farmProject.farmProjectCode == null || farmProject.farmProjectCode == "")
    return "Farm Project Code can not be blank or empty, please try again.";

  return null;
}
