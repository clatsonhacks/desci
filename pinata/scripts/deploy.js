const { ethers } = require("hardhat");

async function main() {
  const PdfStorage = await ethers.deployContract("PdfStorage"); // ✅ Correct Deployment Method

  console.log("Deploying contract...");
  await PdfStorage.waitForDeployment(); // ✅ Ensure Deployment is Completed

  console.log("Contract deployed to:", await PdfStorage.getAddress()); // ✅ Get Address Correctly
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
