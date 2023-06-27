import Web3 from "web3";
import Provider from "@truffle/hdwallet-provider";
import fs from "fs";
import { ethers } from "ethers";
import keythereum from "keythereum";
const contractJson = fs.readFileSync(
  "blockchain/contracts/TrackingModelAbi.json"
);

var SmartContractAddress = "0xf0E4f7313fbf9E7538a48441e1Ce6d4b06c709B9";
var SmartContractABI = JSON.parse(contractJson);
var address = "0xECDbcA8cA437ECc9D601314b7168B5f668568371";
var privatekey =
  "18556d29e398bb540c5ab4a27af51b94d0a22f853b098910bf13d198ff2d48a4";
var rpcurl =
  "https://polygon-mumbai.g.alchemy.com/v2/T-IiG1fGDQ0aOjasn-vtpMYpOqb_9AYr";

export async function sendData(logId) {
  console.log("in function");
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(
    SmartContractABI,
    SmartContractAddress
  );

  const result = await myContract.methods
    .addTrackingBlock(logId.toString(), "UpdateContentNe", address)
    .send({ from: address });

  console.log("Result: ", result);

  var newvalue = await myContract.methods
    .getTrackingBlock("testProductId")
    .call();
  console.log("newvalue", newvalue);

  console.log("done with all things");
}

//contract = 0x4c5a4eee23ad871a77d36e04ce63721a8c7eb25b;

//contract=0xf0E4f7313fbf9E7538a48441e1Ce6d4b06c709B9

export async function unlockAccount() {
  main();
}

let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

async function main() {
  var datadir =
    "/Users/khanhtran/ProjectFlutter/geth-PoA-private-blockchain/node1/data/";
  const password = "myhao12102001";

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
    .addTrackingBlock("Something", "UpdateContentNe", address);
  await tx.wait();
  console.log(tx);
}
