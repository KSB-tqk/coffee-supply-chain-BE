import BlockchainMode from "./blockchain_mode.js";

export const ERROR_MESSAGE = ", please check and try again.";
export const BASE_TRANSACTION_URL = "https://mumbai.polygonscan.com/tx/";
var STEP_LOG_ID = null; // User save id”
var BLOCKCHAIN_MODE = BlockchainMode.Private;
export const BLOCKCHAIN_NETWORK_URL = "http://54.95.160.252:8547";
export const BLOCKCHAIN_DATA_DIR =
  "/home/ubuntu/geth-PoA-Private-Blockchain/node1/data/";
export const BLOCKCHAIN_SMART_CONTRACT_ADDR =
  "0x904e147b4a9a769e680b65F569fb46f174B462c9";
export const BLOCKCHAIN_ADDR = "0xc2197823d2d6a14e58945e50206f683d01ec10f3";
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

var IS_PROCESSING_BLOCKCHAIN = false;

export function setStoring(value) {
  IS_PROCESSING_BLOCKCHAIN = value;
}

export function getStoringStatus() {
  return IS_PROCESSING_BLOCKCHAIN;
}
