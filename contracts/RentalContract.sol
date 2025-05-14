// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalContract {
    struct Rental {
        string tenantName;
        string landlordName;
        string contractId;
        string contractImageHash; // IPFS hash or image hash
        address creator;
        uint256 timestamp;
    }
    
    mapping(string => Rental) public rentals;
    mapping(address => string[]) public userContracts;
    string[] public allContractIds;
    
    event RentalCreated(
        string indexed contractId,
        address indexed creator,
        string tenantName,
        string landlordName
    );
    
    function createRental(
        string memory _contractId,
        string memory _tenantName,
        string memory _landlordName,
        string memory _contractImageHash
    ) public {
        require(bytes(_contractId).length > 0, "Contract ID required");
        require(bytes(rentals[_contractId].contractId).length == 0, "Contract ID already exists");
        
        rentals[_contractId] = Rental({
            tenantName: _tenantName,
            landlordName: _landlordName,
            contractId: _contractId,
            contractImageHash: _contractImageHash,
            creator: msg.sender,
            timestamp: block.timestamp
        });
        
        userContracts[msg.sender].push(_contractId);
        allContractIds.push(_contractId);
        
        emit RentalCreated(_contractId, msg.sender, _tenantName, _landlordName);
    }
    
    function getRental(string memory _contractId) public view returns (
        string memory tenantName,
        string memory landlordName,
        string memory contractId,
        string memory contractImageHash,
        address creator,
        uint256 timestamp
    ) {
        Rental memory rental = rentals[_contractId];
        return (
            rental.tenantName,
            rental.landlordName,
            rental.contractId,
            rental.contractImageHash,
            rental.creator,
            rental.timestamp
        );
    }
    
    function getUserContracts(address _user) public view returns (string[] memory) {
        return userContracts[_user];
    }
    
    function getAllContractIds() public view returns (string[] memory) {
        return allContractIds;
    }
} 