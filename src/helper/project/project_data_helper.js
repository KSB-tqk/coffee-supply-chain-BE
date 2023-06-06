import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import ProjectModel from "../../model/project/project.js";
import transportModel from "../../model/transport/transport.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";
import { onValidUserEmail, onValidUserId } from "../data_helper.js";
import { ObjectId } from "mongodb";
import {
  pushNotification,
  pushNotificationMultiCast,
  pushNotificationToTopic,
} from "../firebase/fcm_helper.js";
import User from "../../model/user/user.js";
import mongoose from "mongoose";

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

export async function onUpdateProjectNotification(
  stepLog,
  modifiedPaths,
  project
) {
  console.log("Modified field", modifiedPaths);
  const projectId = stepLog.projectId.toString();
  try {
    const tokenList = [];
    const user = await User.findById(stepLog.actor);
    if (user == null) {
      console.log("Actor Does Not Exist" + ERROR_MESSAGE);
      return null;
    }

    // check project manager for fcm token
    if (project.manager != null) {
      const manager = await User.findById(project.manager);
      if (manager == null) {
        console.log("Manager Does Not Exist" + ERROR_MESSAGE);
      } else tokenList.push(manager.fcmToken);
    }

    // check project harvest inspector for fcm token
    if (project.harvest != null) {
      const harvest = await harvestModel.findById(project.harvest._id);
      if (harvest == null) {
        console.log("Harvest Does Not Exist" + ERROR_MESSAGE);
      }

      if (harvest.inspector != null) {
        const harvestInspector = await User.findById(harvest.inspector);
        if (harvestInspector == null) {
          console.log("Harvest Inspector Does Not Exist" + ERROR_MESSAGE);
        } else tokenList.push(harvestInspector.fcmToken);
      }
    }

    // check project transport inspector for fcm token
    if (project.transport != null) {
      const transport = await transportModel.findById(project.transport._id);
      if (transport == null) {
        console.log("Transport Does Not Exist" + ERROR_MESSAGE);
      }

      if (transport.inspector != null) {
        const transportInspector = await User.findById(transport.inspector);
        if (transportInspector == null) {
          console.log("Transport Inspector Does Not Exist" + ERROR_MESSAGE);
        } else tokenList.push(transportInspector.fcmToken);
      }
    }

    // check project warehouse storage inspector for fcm token
    if (project.warehouseStorage != null) {
      const warehouseStorage = await warehouseStorageModel.findById(
        project.warehouseStorage._id
      );
      if (warehouseStorage == null) {
        console.log("Warehouse Storage Does Not Exist" + ERROR_MESSAGE);
      }

      if (warehouseStorage.inspector != null) {
        const warehouseStorageInspector = await User.findById(
          warehouseStorage.inspector
        );
        if (warehouseStorageInspector == null) {
          console.log(
            "Warehouse Storage Inspector Does Not Exist" + ERROR_MESSAGE
          );
        } else tokenList.push(warehouseStorageInspector.fcmToken);
      }
    }

    // check project produce inspector for fcm token
    if (project.produce != null) {
      const produce = await ProduceSupervisionModel.findById(
        project.produce._id
      );
      if (produce == null) {
        console.log("Produce Does Not Exist" + ERROR_MESSAGE);
      }

      if (produce.inspector != null) {
        const produceInspector = await User.findById(produce.inspector);
        if (produceInspector == null) {
          console.log("Produce Inspector Does Not Exist" + ERROR_MESSAGE);
        } else tokenList.push(produceInspector.fcmToken);
      }
    }

    await pushNotificationMultiCast(
      tokenList,
      project.projectName + " has been updated.",
      user.lastName +
        " " +
        user.firstName +
        " has update the project field: " +
        modifiedPaths
    );
  } catch (err) {
    throw Error(err.message);
  }
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

      case State.Processing:
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
