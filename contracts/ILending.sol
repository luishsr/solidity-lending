// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ILending {

    /* ===== EVENTS =========== */
    event LendingRequestSubmitted(address indexed from, uint256 amount);
    event LendingRequestRejected(uint256 indexed id);
    event LendingRequestApproved(uint256 indexed id);

    /**
    * @dev Custom errors
    **/
    error Lending_OnlyOwnerCanPerformOperation();
    error Lending_AmountMustBeGreaterThanZero();

    /**
    * @dev Lending request
    **/
    struct LendingRequest{
        uint256 id;
        address requester;
        uint256 amount;
        LendingRequestStatus status;
    }

    /**
    * @dev Lending request status
    **/
    enum LendingRequestStatus{
        Awaiting,
        Approved,
        Rejected
    }

}