import Web3 from "web3";
import Provider from "@truffle/hdwallet-provider";
import fs from "fs";

const contractJson = fs.readFileSync(
  "blockchain/contracts/TrackingModelAbi.json"
);

var SmartContractAddress = "0x456E5aC29729C18d4C43ef3a1aA91074E9b3bD38";
var SmartContractABI = JSON.parse(contractJson);
var address = "0x4Fb3A0f1Bc360E6CFE5E400f7F68220b5ef5C8c8";
var privatekey =
  "18556d29e398bb540c5ab4a27af51b94d0a22f853b098910bf13d198ff2d48a4";
var rpcurl =
  "https://polygon-mumbai.g.alchemy.com/v2/dansTXmThZA3jPgRwOuk0DIHn9obm666";

export async function sendData() {
  console.log("in function");
  var provider = new Provider(privatekey, rpcurl);
  var web3 = new Web3(provider);
  var myContract = new web3.eth.Contract(
    SmartContractABI,
    SmartContractAddress
  );

  var oldvalue = await myContract.methods
    .addTrackingBlock("testProductId", "testContent", address)
    .send({ from: address });
  console.log("oldvalue", oldvalue);

  var newvalue = await myContract.methods
    .getTrackingBlock("testProductId")
    .call();
  console.log("newvalue", newvalue);

  console.log("done with all things");
}
