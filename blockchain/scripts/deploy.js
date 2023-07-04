// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unTrackingModelTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const TrackingModeledAmount = hre.ethers.utils.parseEther("1");

  const TrackingModel = await hre.ethers.getContractFactory("TrackingModel");
  const trackingModel = await TrackingModel.deploy();

  await trackingModel.deployed();

  console.log(
    `TrackingModel with 1 ETH and unTrackingModel timestamp ${unTrackingModelTime} deployed to ${trackingModel.address}`
  );
}

// async function main() {
//   console.log(
//     "Deploying contracts with the account:",
//     "0x12BEb1f1b039058EA53826433c2901561E49E594"
//   );

//   const token = await ethers.deploy("Token");

//   console.log("Token address:", await token.getAddress());
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
