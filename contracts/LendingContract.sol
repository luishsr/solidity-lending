// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract LendingContract{

    /* ======== LIBRARIES =================*/

    using Math for uint256;

    /* ======== DATA STRUCTURES ===========*/

    // A lending request
    struct LendingRequest {
        uint256 id;
        address requester;
        uint256 createdAt;
        uint256 expirationDate;
        uint256 amount;
        RequestStatus status;
    }

    // Lending Request status
    enum RequestStatus {
        Open,
        Approved,
        Rejected
    }

    /* ====== MODIFIERS ===================*/

    // Only the owner can perform certain operations
    modifier onlyOwner{
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    /* ====== STATE VARIABLES =============*/

    // List of requests
    mapping (uint256 => LendingRequest) requests;

    // The total number of requests
    uint256 public requestCount;

    // Contract Owner
    address private owner;

    /* ====== EVENTS ======================*/

    // An event emitted when a new lending request is created
    event RequestCreated(address indexed requester, uint256 amount);

    // An event emitted when a request is approved
    event RequestApproved(uint256 indexed requestId);

    // An event emitted when a request is denied
    event RequestRejected(uint256 indexed requestId);

    /* ===== CONSTRUCTOR ===================*/

    constructor (){
        owner = msg.sender;
    }

    /* ===== VIEWS =========================*/

    /**
     * @dev Returns the Request by it's id
     * @return id The id of the Request
     * @param _id The id of the Request
     * @return requester The requester
     * @return createdAt The request creation date
     * @return expirationDate The requesrt expiration date
     * @return amount The request amount
     * @return status The request status
     */
    function getRequest(uint256 _id) 
        public 
        view 
        returns (
            uint256 id,
            address requester,
            uint256 createdAt,
            uint256 expirationDate,
            uint256 amount,
            RequestStatus status
        )
    {
        LendingRequest storage request = requests[_id];
        return (request.id, request.requester, request.createdAt, request.expirationDate, request.amount, request.status);
    }

    /* ==== MUTATIVE FUNCTIONS ==============*/


    /**
     * @dev Submit a Lending Request
     * @param amount The amount requested
     * @return requestId The id of the created request
     */
    function createRequest(uint256 amount) public returns (uint256 requestId){

        // Minimum amount 10 ETH
        require(amount >= 10 ether, "Minimum required amount is 10 ETH");
        
        requestCount++;
        uint256 newRequestId = requestCount;

        LendingRequest storage newRequest = requests[newRequestId];

        newRequest.id = newRequestId;
        newRequest.requester = msg.sender;
        newRequest.amount = amount;
        newRequest.createdAt = block.timestamp;
        newRequest.expirationDate = block.timestamp + 5; // Request expires in 5 days after creation
        newRequest.status = RequestStatus.Open;

        emit RequestCreated(newRequest.requester, newRequest.amount);

        return newRequestId;
    }

     /**
     * @dev Approve a Lending Request
     * @param requestId The request id
     */
    function approveRequest(uint256 requestId) public onlyOwner{
        LendingRequest storage request = requests[requestId];

        request.status = RequestStatus.Approved;

        //TODO: transfer funds

        emit RequestApproved(requestId);
    }

     /**
     * @dev Reject a Lending Request
     * @param requestId The request id
     */
    function rejectRequest(uint256 requestId) public onlyOwner{
        LendingRequest storage request = requests[requestId];

        request.status = RequestStatus.Rejected;

        emit RequestRejected(requestId);
    }


}