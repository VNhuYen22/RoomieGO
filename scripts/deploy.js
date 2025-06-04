const hre = require("hardhat");

async function main() {
  console.log("Đang deploy RentalContract...");
  
  const RentalContract = await hre.ethers.getContractFactory("RentalContract");
  const rentalContract = await RentalContract.deploy();

  console.log("Đang đợi contract được deploy...");
  await rentalContract.waitForDeployment();

  const address = await rentalContract.getAddress();
  console.log("RentalContract đã được deploy tại địa chỉ:", address);
  console.log("Hãy copy địa chỉ này và cập nhật vào file testRental.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Lỗi khi deploy:", error);
    process.exit(1);
  });