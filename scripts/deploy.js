const { ethers } = require("hardhat");

async function main() {
  const PdfStorage = await ethers.deployContract("PdfStorage"); 

  console.log("Deploying contract...");
  await PdfStorage.waitForDeployment(); 

  console.log("Contract deployed to:", await PdfStorage.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
