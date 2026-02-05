import { ethers } from "ethers";
import ABI from "../abi/WarrantyManager.json";

// 🔴 ĐỊA CHỈ CONTRACT SEPOLIA (ĐÚNG)
const CONTRACT_ADDRESS = "0xaCF40B794b91fd8601217045f0CF84Fc23056f7E";

/* ================= GET CONTRACT ================= */
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI.abi, // ethers v6
    signer
  );
};

/* ================= READ: orderCount ================= */
export const getOrderCount = async () => {
  const contract = await getContract();
  return await contract.orderCount();
};

/* ================= READ: getOrderByIndex ================= */
export const getOrderByIndex = async (index) => {
  const contract = await getContract();
  const result = await contract.getOrderByIndex(index);

  return {
    orderId: result[0],
    productId: result[1],
    amountVND: result[2],
    buyer: result[3],
    createdAt: result[4]
  };
};

/* ================= WRITE: createOrder ================= */
export const createOrder = async (productId, amountVND) => {
  const contract = await getContract();
  const tx = await contract.createOrder(productId, amountVND);
  await tx.wait();
  return tx.hash;
};