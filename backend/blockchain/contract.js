const { ethers } = require("ethers");
const abi = require("./abi.json");

const RPC_URL = process.env.RPC_URL;               // http://127.0.0.1:8545
const PRIVATE_KEY = process.env.PRIVATE_KEY;       // account #0
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing RPC_URL / PRIVATE_KEY / CONTRACT_ADDRESS");
}

// Provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Wallet (OWNER – account deploy contract)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract instance (SIGNED)
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  abi,
  wallet
);

module.exports = contract;
