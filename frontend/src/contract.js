import { ethers } from "ethers";

// 🔴 DÁN ĐỊA CHỈ CONTRACT BẠN VỪA DEPLOY
export const CONTRACT_ADDRESS = "0xABC123..."; 

export const CONTRACT_ABI = [
  "function orderCount() view returns (uint256)",
  "function createOrder(string _productName)"
];

export function getContract() {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
}