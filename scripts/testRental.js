const hre = require("hardhat");

async function main() {
  let rentalContract;
  try {
    console.log("Đang kết nối với contract...");
    const RentalContract = await hre.ethers.getContractFactory("RentalContract");
    rentalContract = await RentalContract.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    console.log("Đã kết nối với contract tại:", await rentalContract.getAddress());

    // Tạo một hợp đồng mới với ID ngẫu nhiên
    const contractId = "RENT" + Date.now();
    const tenantName = "Nguyen Van A";
    const landlordName = "Tran Van B";
    const contractImageHash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

    console.log("Đang tạo hợp đồng với ID:", contractId);
    const tx = await rentalContract.createRental(
      contractId,
      tenantName,
      landlordName,
      contractImageHash
    );
    
    console.log("Transaction hash:", tx.hash);
    console.log("Đang đợi transaction được xác nhận...");
    await tx.wait();
    console.log("Transaction đã được xác nhận!");

    // Đợi một chút để đảm bảo transaction đã được xử lý
    console.log("Đợi 5 giây để đảm bảo transaction đã được xử lý...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Đang lấy thông tin hợp đồng...");
    const rental = await rentalContract.getRental(contractId);
    
    // Chuyển đổi timestamp từ BigInt sang Date
    const timestamp = Number(rental.timestamp) * 1000;
    
    console.log("Thông tin hợp đồng:", {
      tenantName: rental.tenantName,
      landlordName: rental.landlordName,
      contractId: rental.contractId,
      contractImageHash: rental.contractImageHash,
      creator: rental.creator,
      timestamp: new Date(timestamp).toLocaleString()
    });

  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    if (error.info) {
      console.error("Thông tin thêm:", error.info);
    }
    // Thử lấy thông tin contract
    if (rentalContract) {
      try {
        const contractAddress = await rentalContract.getAddress();
        console.log("Contract address:", contractAddress);
      } catch (e) {
        console.error("Không thể lấy địa chỉ contract:", e);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Lỗi:", error);
    process.exit(1);
  }); 