async function main() {
  const RentalContract = await ethers.getContractFactory("RentalContract");
  const rental = await RentalContract.deploy();
  await rental.deployed();
  
  console.log("RentalContract deployed to:", rental.address);
  
  // Save contract address
  const fs = require('fs');
  const contractsDir = './frontend/src/contracts';
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    contractsDir + '/contract-address.json',
    JSON.stringify({ RentalContract: rental.address }, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 