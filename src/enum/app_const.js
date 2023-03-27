export const ERROR_MESSAGE = ", please check and try again.";
var STEP_LOG_ID = ""; // User save id”

export function setStepLogId(stepId) {
  STEP_LOG_ID = stepId;
}

export function getStepLogId() {
  return STEP_LOG_ID;
}
