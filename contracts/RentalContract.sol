// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalContract {
    struct Contract {
        uint256 id;
        address tenant;
        address owner;
        uint256 roomId;
        uint256 startDate;
        uint256 endDate;
        uint256 pricePerMonth;
        bool isActive;
        bool isPaid;
    }

    mapping(uint256 => Contract) public contracts;
    uint256 public contractCount;

    event ContractCreated(
        uint256 indexed contractId,
        address indexed tenant,
        address indexed owner,
        uint256 roomId,
        uint256 startDate,
        uint256 endDate,
        uint256 pricePerMonth
    );

    event PaymentMade(
        uint256 indexed contractId,
        address indexed tenant,
        uint256 amount
    );

    function createContract(
        address _tenant,
        uint256 _roomId,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _pricePerMonth
    ) public returns (uint256) {
        require(_tenant != address(0), "Invalid tenant address");
        require(_startDate < _endDate, "Invalid date range");
        require(_pricePerMonth > 0, "Price must be greater than 0");

        contractCount++;
        contracts[contractCount] = Contract({
            id: contractCount,
            tenant: _tenant,
            owner: msg.sender,
            roomId: _roomId,
            startDate: _startDate,
            endDate: _endDate,
            pricePerMonth: _pricePerMonth,
            isActive: true,
            isPaid: false
        });

        emit ContractCreated(
            contractCount,
            _tenant,
            msg.sender,
            _roomId,
            _startDate,
            _endDate,
            _pricePerMonth
        );

        return contractCount;
    }

    function makePayment(uint256 _contractId) public payable {
        Contract storage contract = contracts[_contractId];
        require(contract.isActive, "Contract is not active");
        require(msg.sender == contract.tenant, "Only tenant can make payment");
        require(msg.value >= contract.pricePerMonth, "Insufficient payment amount");

        contract.isPaid = true;
        payable(contract.owner).transfer(msg.value);

        emit PaymentMade(_contractId, msg.sender, msg.value);
    }

    function getContract(uint256 _contractId) public view returns (
        uint256 id,
        address tenant,
        address owner,
        uint256 roomId,
        uint256 startDate,
        uint256 endDate,
        uint256 pricePerMonth,
        bool isActive,
        bool isPaid
    ) {
        Contract storage contract = contracts[_contractId];
        return (
            contract.id,
            contract.tenant,
            contract.owner,
            contract.roomId,
            contract.startDate,
            contract.endDate,
            contract.pricePerMonth,
            contract.isActive,
            contract.isPaid
        );
    }
}