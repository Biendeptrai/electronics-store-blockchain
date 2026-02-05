const hre = require("hardhat");

async function main() {
  const ElectronicsStore = await hre.ethers.getContractFactory("ElectronicsStore");
  const contract = await ElectronicsStore.deploy();
  await contract.waitForDeployment();

  console.log("ElectronicsStore deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
