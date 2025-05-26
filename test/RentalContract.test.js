const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalContract", function () {
  let rentalContract;
  let owner;
  let tenant;
  let otherAccount;
  const roomId = 1;
  const startDate = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
  const endDate = startDate + 2592000; // 30 days later
  const pricePerMonth = ethers.utils.parseEther("1.0"); // 1 ETH

  beforeEach(async function () {
    [owner, tenant, otherAccount] = await ethers.getSigners();
    const RentalContract = await ethers.getContractFactory("RentalContract");
    rentalContract = await RentalContract.deploy();
    await rentalContract.deployed();
  });

  describe("Contract Creation", function () {
    it("Should create a new contract", async function () {
      const tx = await rentalContract.createContract(
        tenant.address,
        roomId,
        startDate,
        endDate,
        pricePerMonth
      );

      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'ContractCreated');
      
      expect(event.args.tenant).to.equal(tenant.address);
      expect(event.args.owner).to.equal(owner.address);
      expect(event.args.roomId).to.equal(roomId);
    });

    it("Should not create contract with invalid dates", async function () {
      await expect(
        rentalContract.createContract(
          tenant.address,
          roomId,
          endDate,
          startDate,
          pricePerMonth
        )
      ).to.be.revertedWith("Invalid date range");
    });
  });

  describe("Payment", function () {
    let contractId;

    beforeEach(async function () {
      const tx = await rentalContract.createContract(
        tenant.address,
        roomId,
        startDate,
        endDate,
        pricePerMonth
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'ContractCreated');
      contractId = event.args.contractId;
    });

    it("Should accept payment from tenant", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await rentalContract.connect(tenant).makePayment(contractId, { value: pricePerMonth });
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance.sub(initialBalance)).to.equal(pricePerMonth);
    });

    it("Should not accept payment from non-tenant", async function () {
      await expect(
        rentalContract.connect(otherAccount).makePayment(contractId, { value: pricePerMonth })
      ).to.be.revertedWith("Only tenant can make payment");
    });
  });

  describe("Contract Termination", function () {
    let contractId;

    beforeEach(async function () {
      const tx = await rentalContract.createContract(
        tenant.address,
        roomId,
        startDate,
        endDate,
        pricePerMonth
      );
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'ContractCreated');
      contractId = event.args.contractId;
    });

    it("Should allow owner to terminate contract", async function () {
      await rentalContract.terminateContract(contractId);
      const contract = await rentalContract.getContract(contractId);
      expect(contract.isActive).to.be.false;
    });

    it("Should allow tenant to terminate contract", async function () {
      await rentalContract.connect(tenant).terminateContract(contractId);
      const contract = await rentalContract.getContract(contractId);
      expect(contract.isActive).to.be.false;
    });

    it("Should not allow others to terminate contract", async function () {
      await expect(
        rentalContract.connect(otherAccount).terminateContract(contractId)
      ).to.be.revertedWith("Not authorized");
    });
  });
});