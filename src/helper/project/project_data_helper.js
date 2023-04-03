import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import ProjectModel from "../../model/project/project.js";
import transportModel from "../../model/transport/transport.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";
import { onValidUserEmail, onValidUserId } from "../data_helper.js";
import { ObjectId } from "mongodb";

export async function onValidProjectInfo(project, userEmail) {
  const isExistProjectCode = await ProjectModel.findOne({
    projectCode: project.projectCode,
  });
  const isValidUser = await onValidUserEmail(userEmail);

  if (isExistProjectCode) {
    return "Project Code already exist" + ERROR_MESSAGE;
  }

  if (!isValidUser) {
    return "User Not Found" + ERROR_MESSAGE;
  }

  return null;
}

export async function onUpdateProjectState(project, updateState) {
  try {
    switch (project.state) {
      case State.Completed:
        project.dateCompleted = Date.now();
        const harvest = await harvestModel.findById(ObjectId(project.harvest));
        const produce = await ProduceSupervisionModel.findById(
          ObjectId(project.produce)
        );
        const transport = await transportModel.findById(
          ObjectId(project.transport)
        );
        const warehouseStorage = await warehouseStorageModel.findById(
          ObjectId(project.warehouseStorage)
        );

        if (
          harvest.state == State.Completed &&
          produce.state == State.Completed &&
          transport.state == State.Completed &&
          warehouseStorage.state == State.Completed
        ) {
          harvest.dateCompleted = Date.now();
          produce.dateCompleted = Date.now();
          transport.dateCompleted = Date.now();
          warehouseStorage.dateCompleted = Date.now();

          harvest.save();
          produce.save();
          transport.save();
          warehouseStorage.save();
        } else throw Error("Invalid state update" + ERROR_MESSAGE);

        break;

      case State.Pending:
        break;

      case State.Canceled:
        project.dateCompleted = Date.now();
        await harvestModel.findByIdAndUpdate(ObjectId(project.harvest), {
          dateCompleted: Date.now(),
          state: 3,
        });
        await ProduceSupervisionModel.findByIdAndUpdate(
          ObjectId(project.produce),
          {
            dateCompleted: Date.now(),
            state: 3,
          }
        );
        await transportModel.findByIdAndUpdate(ObjectId(project.transport), {
          dateCompleted: Date.now(),
          state: 3,
        });
        await warehouseStorageModel.findByIdAndUpdate(
          ObjectId(project.warehouseStorage),
          {
            outputDate: Date.now(),
            state: 3,
          }
        );
        break;

      case State.NotYet:

      default:
    }

    return project;
  } catch (err) {
    throw Error(err.message);
  }
}
