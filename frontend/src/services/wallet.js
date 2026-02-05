import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask");
    return null;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  const chainId = await window.ethereum.request({
    method: "eth_chainId"
  });

  // Sepolia = 0xaa36a7
  if (chainId !== "0xaa36a7") {
    alert("Vui lòng chuyển sang mạng Sepolia");
    return null;
  }

  return accounts[0];
};

export const getSigner = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
};