require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/488da847ebfc4b628a44ed7f04344311",
      accounts: [
        "0x54985981d97ff3ff576d91fff22bf003c5560c629ba532ba1fbd358fc205ea3c"
      ]
    }
  }
};