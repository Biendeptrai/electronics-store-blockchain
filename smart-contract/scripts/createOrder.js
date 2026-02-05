const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0xaCF40B794b91fd8601217045f0CF84Fc23056f7E"; // 👈 DÁN ĐỊA CHỈ MỚI DEPLOY

  const contract = await hre.ethers.getContractAt(
    "WarrantyManager",
    CONTRACT_ADDRESS
  );

  console.log("Contract:", await contract.getAddress());

  const tx = await contract.createOrder(101, 5000000);
  console.log("Tx hash:", tx.hash);

  await tx.wait();
  console.log("✅ Create order SUCCESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});