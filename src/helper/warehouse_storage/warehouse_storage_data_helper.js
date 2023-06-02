import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProjectModel from "../../model/project/project.js";
import transportModel from "../../model/transport/transport.js";

export async function isValidWarehouseStateUpdate(
  warehouseStorage,
  state,
  oldState
) {
  try {
    if (warehouseStorage.projectId == null)
      throw Error("Warehouse Storage Project Id can not be null");
    console.log("ProjectId", warehouseStorage.projectId);
    const project = await ProjectModel.findById(warehouseStorage.projectId);
    if (project == null) throw Error("Project does not exist");
    const transport = await transportModel.findById(project.transport);
    if (transport == null) throw Error("Transport does not exist");

    if (transport.state == State.Completed) {
      if (state == State.Completed) {
        if (warehouseStorage.projectId == null)
          throw Error("Warehouse Storage Project Id can not be null");
        if (warehouseStorage.projectCode == "")
          throw Error("Warehouse Storage Project Id can not be null");
        if (warehouseStorage.warehouseStorageId == "")
          throw Error("Warehouse Storage Id can not be blank");
        if (warehouseStorage.warehouse == "")
          throw Error("Warehouse in Warehouse Storage can not be blank");
        if (warehouseStorage.inspector == null)
          throw Error("Warehouse Storage Inspector can not be null");
        if (oldState != State.Proccessing)
          throw Error("Warehouse Storage State can not be change to Completed");
      }
      return true;
    } else throw Error("Transport State is not completed");
  } catch (err) {
    throw Error(err.message + ERROR_MESSAGE);
  }
}
