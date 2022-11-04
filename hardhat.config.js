require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');

/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_GOERLI_API_KEY = require("./cfg.json").goerliNodeEndpoint;
const GOERLI_PRIVATE_KEY = require("./cfg.json").PrivateKey1;
const ETHERSCAN_API_KEY = require("./cfg.json").goerliEtherscanApi;

module.exports = {
  solidity: "0.8.9",

  networks: {
    goerli: {
      url: `${ALCHEMY_GOERLI_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },

  abiExporter: {
	  path: "./abiOneFive",
	  clear: false,
	  flat: true,
    runOnCompile: true,
  },

  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  },

  settings: {
    optimizer: {
      enabled: true,
      runs: 500,
    }
  }
};
