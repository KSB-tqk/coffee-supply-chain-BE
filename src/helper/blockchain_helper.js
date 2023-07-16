import Web3 from "web3";
import Provider from "@truffle/hdwallet-provider";
import fs from "fs";
import { ethers } from "ethers";
import keythereum from "keythereum";
import {
  BLOCHAIN_ADDR_PASSWORD,
  BLOCKCHAIN_ADDR,
  BLOCKCHAIN_DATA_DIR,
  BLOCKCHAIN_NETWORK_URL,
  BLOCKCHAIN_SMART_CONTRACT_ADDR,
  PATH_TO_BLOCKCHAIN_ABI,
  getBlockchainMode,
  setBlockchainMode,
} from "../enum/app_const.js";
import BlockchainMode from "../enum/blockchain_mode.js";
import StepLogModel from "../model/step_log/step_log.js";

const contractJson = fs.readFileSync(PATH_TO_BLOCKCHAIN_ABI);
var SmartContractAddress = BLOCKCHAIN_SMART_CONTRACT_ADDR;
var SmartContractABI = JSON.parse(contractJson);
var datadir = BLOCKCHAIN_DATA_DIR;
var address = BLOCKCHAIN_ADDR;
var password = BLOCHAIN_ADDR_PASSWORD;
let provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_NETWORK_URL);

export async function createTransaction(blockId, blockContent) {
  var keyObject = keythereum.importFromFile(address, datadir);
  var privateKey = keythereum.recover(password, keyObject);
  console.log(privateKey.toString("hex"));

  let wallet = new ethers.Wallet(privateKey, provider);
  const myContract = new ethers.Contract(
    SmartContractAddress,
    SmartContractABI,
    provider
  );

  let tx = await myContract
    .connect(wallet)
    .addTrackingBlock(blockId, blockContent, address);
  await tx.wait();
  console.log(tx);
  return tx;
}

export async function storeLogOnBlockchain(transactionHash, stepLog) {
  const blockMode = getBlockchainMode();

  console.log("blockMode:" + blockMode);

  switch (parseInt(blockMode, 10)) {
    case BlockchainMode.Public:
      break;
    case BlockchainMode.Private:
      console.log("Here it in");
      if (transactionHash != null) return;
      const result = await createTransaction(
        "|Step Log Id:" + stepLog._id.toString() + "|",
        JSON.stringify(stepLog)
      );
      const stepLogModel = await StepLogModel.findById(stepLog._id);
      console.log(result);
      stepLogModel.transactionHash = result.hash;
      await stepLogModel.save();
      break;
    case BlockchainMode.Local:
      break;
  }
}

export async function getTransactionReceipt(transactionHash) {
  var keyObject = keythereum.importFromFile(address, datadir);
  var privateKey = keythereum.recover(password, keyObject);
  console.log(privateKey.toString("hex"));

  var provider = new Provider(
    privateKey.toString("hex"),
    BLOCKCHAIN_NETWORK_URL
  );

  // Creating a Provider Instance (to query blockchain)
  const web3 = new Web3(provider);

  const transaction = await web3.eth.getTransaction(transactionHash);

  console.log(transaction);

  const transactionReceipt = await web3.eth.getTransactionReceipt(
    transactionHash
  );

  console.log(transactionReceipt);

  const blockInfo = await web3.eth.getBlock(transactionReceipt.blockNumber);

  console.log(blockInfo);

  const inputData = web3.utils.hexToAscii(transaction.input);

  console.log(inputData);

  return inputData;
}

// var privatekey =
//   "18556d29e398bb540c5ab4a27af51b94d0a22f853b098910bf13d198ff2d48a4";
// var rpcurl =
//   "https://polygon-mumbai.g.alchemy.com/v2/T-IiG1fGDQ0aOjasn-vtpMYpOqb_9AYr";

// export async function sendData(logId) {
//   console.log("in function");
//   var provider = new Provider(privatekey, rpcurl);
//   var web3 = new Web3(provider);
//   var myContract = new web3.eth.Contract(
//     SmartContractABI,
//     SmartContractAddress
//   );

//   const result = await myContract.methods
//     .addTrackingBlock(logId.toString(), "UpdateContentNe", address)
//     .send({ from: address });

//   console.log("Result: ", result);

//   var newvalue = await myContract.methods
//     .getTrackingBlock("testProductId")
//     .call();
//   console.log("newvalue", newvalue);

//   console.log("done with all things");
// }

//contract = 0x4c5a4eee23ad871a77d36e04ce63721a8c7eb25b;

//contract=0xf0E4f7313fbf9E7538a48441e1Ce6d4b06c709B9
