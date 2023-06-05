import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import ProjectModel from "../../model/project/project.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";

export async function isValidProduceStateUpdate(produce, state, oldState) {
  try {
    if (produce.projectId == null)
      throw Error("Produce Supervision Project Id can not be null");

    const project = await ProjectModel.findById(produce.projectId);
    if (project == null)
      throw Error("Project of Produce Supervision model does not exist");
    const warehouseStorage = await warehouseStorageModel.findById(
      project.warehouseStorage
    );
    if (warehouseStorage == null)
      throw Error("Warehouse Storage in the project does not exist");

    if (warehouseStorage.state == State.Completed) {
      if (state == State.Completed) {
        if (produce.projectId == null)
          throw Error("Produce Supervision Project Id can not be null");
        if (produce.projectCode == "")
          throw Error("Produce Supervision Project Code can not be null");
        if (produce.produceSupervisionId == "")
          throw Error("Produce Supervision Id can not be blank");
        if (produce.factory == "") throw Error("Factory can not be blank");
        if (produce.inspector == null)
          throw Error("Produce Supervision Inspector can not be null");
        if (oldState != State.Processing)
          throw Error(
            "Produce Supervision State can not be change to Completed"
          );
      }
      return true;
    } else throw Error("Warehouse Storage State is not completed");
  } catch (err) {
    throw Error(err.message + ERROR_MESSAGE);
  }
}
