const hre = require("hardhat");

async function main() {
  // ✅ LẤY CONTRACT WARRANTY MANAGER
  const WarrantyManager = await hre.ethers.getContractFactory("WarrantyManager");

  // ✅ DEPLOY
  const contract = await WarrantyManager.deploy();
  await contract.waitForDeployment();

  // ✅ IN RA ĐỊA CHỈ CONTRACT
  console.log("WarrantyManager deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});