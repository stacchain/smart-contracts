require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config(); // Load environment variables

module.exports = {
  solidity: "0.8.0", // Solidity version
  networks: {
    hardhat: {
      chainId: 1337, // Local Hardhat network
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL, // Mumbai Testnet RPC URL
      accounts: [process.env.MUMBAI_PRIVATE_KEY], // Private key for Mumbai
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL, // Polygon Mainnet RPC URL
      accounts: [process.env.POLYGON_PRIVATE_KEY], // Private key for Polygon Mainnet
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // API key for contract verification
  },
};
