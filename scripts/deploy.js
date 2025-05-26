const hre = require("hardhat");

async function main() {
  console.log("Deploying RentalContract...");

  const RentalContract = await hre.ethers.getContractFactory("RentalContract");
  const rentalContract = await RentalContract.deploy();

  await rentalContract.deployed();

  console.log("RentalContract deployed to:", rentalContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 