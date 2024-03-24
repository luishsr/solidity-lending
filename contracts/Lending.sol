// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ILending.sol";

contract Lending is ILending{

    /* ===== STATE VARIABLES == */
    mapping(uint256 => LendingRequest) lendingRequests;
    address owner;
    uint256 requestsCount = 0;

    /**
    * @dev Constructor sets the owner
    **/
    constructor (){
        owner = msg.sender;
    }

    /**
    * @dev Submit a Lending Request
    **/
    function submitRequest(uint256 amount) external returns (uint256 id){
        if (amount < 1){
            revert Lending_AmountMustBeGreaterThanZero();
        }

        requestsCount++;

        LendingRequest memory request = LendingRequest(
            requestsCount,
            msg.sender,
            amount,
            LendingRequestStatus.Awaiting 
        );

        lendingRequests[requestsCount] = request;

        emit LendingRequestSubmitted(msg.sender, amount);

        return requestsCount;
    }

    /**
    * @dev Find a Lending Request by ID
    **/
    function findRequestById(uint256 _id) public view returns (LendingRequest memory request){
        return lendingRequests[_id];
    }

    /**
    * @dev Return the contract owner
    **/
    function getOwner() external view returns (address _owner){
        return owner;
    }

    /**
    * @dev Approve a Lending Request
    **/
    function approveRequest(uint256 _id) external {

        if (msg.sender != owner){
            revert Lending_OnlyOwnerCanPerformOperation();
        }

        LendingRequest memory request = lendingRequests[_id];

        request.status = LendingRequestStatus.Approved;

        emit LendingRequestApproved(_id);
    }

    /**
    * @dev Reject a Lending Request
    **/
    function rejectRequest(uint256 _id) external {
        if (msg.sender != owner){
            revert Lending_OnlyOwnerCanPerformOperation();
        }

        LendingRequest memory request = lendingRequests[_id];

        request.status = LendingRequestStatus.Rejected;

        emit LendingRequestRejected(_id);

    }

}