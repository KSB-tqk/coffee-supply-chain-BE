import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";

export async function isValidHarvestStateUpdate(harvest, state, oldState) {
  try {
    console.log("State", state);
    console.log("Old State", oldState);
    if (state == State.Completed) {
      console.log("Harvest Model", harvest);
      if (harvest.projectId == null)
        throw Error("Harvest Project Id can not be null" + ERROR_MESSAGE);
      if (harvest.inspector == null)
        throw Error("Harvest Inspector can not be null" + ERROR_MESSAGE);
      if (oldState != State.Pending)
        throw Error(
          "Harvest state can not change to Completed" + ERROR_MESSAGE
        );
      if (harvest.projectCode == "")
        throw Error("Harvest Project Code can not be blank" + ERROR_MESSAGE);
      if (harvest.harvestId == null)
        throw Error("HarvestId can not be null" + ERROR_MESSAGE);
    }
    return true;
  } catch (err) {
    throw Error(err.message);
  }
}
