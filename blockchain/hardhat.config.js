require("@nomiclabs/hardhat-waffle");
module.exports = {
  localhost: {
    url: "http://127.0.0.1:8545",
    account: [
      "faf149372e318e5f1c2253b949d6b4e5da5294735877a3cd663d32d5828d33a1",
    ],
  },
  hardhat: {
    // See its defaults
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
