import { ethers } from "ethers";
import ABI from "../abi/WarrantyManager.json";

// 🔴 CONTRACT DEPLOY TRÊN SEPOLIA (ĐÚNG)
const CONTRACT_ADDRESS = "0xB9537456C59746c747B73B171Ed3428c25281512";

/* ================= GET CONTRACT ================= */
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài");
  }

  // ⚠️ ethers v6
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
};

/* ================= READ: owner (ADMIN) ================= */
export const getOwner = async () => {
  const contract = await getContract();
  const owner = await contract.owner();
  return owner;
};

/* ================= READ: orderCount ================= */
export const getOrderCount = async () => {
  const contract = await getContract();
  const count = await contract.orderCount();
  return Number(count); // ⚠️ convert BigInt → number
};

/* ================= READ: getOrderByIndex ================= */
export const getOrderByIndex = async (index) => {
  const contract = await getContract();
  const o = await contract.getOrderByIndex(index);

  return {
    orderId: Number(o[0]),
    productId: Number(o[1]),
    amountVND: Number(o[2]),
    buyer: o[3],
    createdAt: Number(o[4])
  };
};

/* ================= WRITE: createOrder (ADMIN ONLY) ================= */
export const createOrder = async (productId, amountVND, buyer) => {
  const contract = await getContract();

  const tx = await contract.createOrder(
    Number(productId),
    Number(amountVND),
    buyer
  );

  await tx.wait();
  return tx.hash;
};