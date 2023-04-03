import { ERROR_MESSAGE } from "../../enum/app_const.js";
import ProjectModel from "../../model/project/project.js";
import { onValidUserEmail, onValidUserId } from "../data_helper.js";

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

export async function onUpdateProject(project) {
  try {
  } catch (err) {
    throw Error(err);
  }
}
