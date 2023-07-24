import BlockchainMode from "./blockchain_mode.js";

export const ERROR_MESSAGE = ", please check and try again.";
export const BASE_TRANSACTION_URL = "https://mumbai.polygonscan.com/tx/";
var STEP_LOG_ID = null; // User save id”
var BLOCKCHAIN_MODE = BlockchainMode.Private;
export const BLOCKCHAIN_NETWORK_URL = "http://127.0.0.1:8545";
export const BLOCKCHAIN_DATA_DIR =
  "/Users/khanhtran/ProjectFlutter/geth-PoA-private-blockchain/node1/data/";
export const BLOCKCHAIN_SMART_CONTRACT_ADDR =
  "0x04cCBE65574b5311b60472FE1b88d289166434a7";
export const BLOCKCHAIN_ADDR = "0x12BEb1f1b039058EA53826433c2901561E49E594";
export const PATH_TO_BLOCKCHAIN_ABI =
  "blockchain/contracts/TrackingModelAbi.json";
export const BLOCHAIN_ADDR_PASSWORD = "myhao12102001";

export function setStepLogId(stepId) {
  STEP_LOG_ID = stepId;
}

export function getStepLogId() {
  return STEP_LOG_ID;
}

export function setBlockchainMode(blockchainMode) {
  BLOCKCHAIN_MODE = blockchainMode;
}

export function getBlockchainMode() {
  return BLOCKCHAIN_MODE;
}
