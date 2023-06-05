import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProjectModel from "../../model/project/project.js";

export async function isValidTransportStateUpdate(transport, state, oldState) {
  try {
    if (transport.projectId == null)
      throw Error("Transport Project Id can not be null");

    const project = await ProjectModel.findById(transport.projectId);
    if (project == null)
      throw Error("Project of transport model does not exist");
    const harvest = await harvestModel.findById(project.harvest);
    if (harvest == null) throw Error("Harvest in the project does not exist");

    if (harvest.state == State.Completed) {
      if (state == State.Completed) {
        if (transport.projectId == null)
          throw Error("Transport Project Id can not be null");
        if (transport.projectCode == "")
          throw Error("Transport Project Id can not be null");
        if (transport.transportId == "")
          throw Error("Transport Id can not be blank");
        if (transport.transport == "")
          throw Error("Transport can not be blank");
        if (transport.inspector == null)
          throw Error("Transport Inspector can not be null");
        if (oldState != State.Processing)
          throw Error("Transport State can not be change to Completed");
      }
      return true;
    } else throw Error("Harvest State is not completed");
  } catch (err) {
    throw Error(err.message + ERROR_MESSAGE);
  }
}
