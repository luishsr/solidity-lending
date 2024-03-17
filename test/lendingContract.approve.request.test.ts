import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Provider } from "@ethersproject/abstract-provider";

describe("LendingContract - Request Approval", function () {
    let lendingContract: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
  
    beforeEach(async function () {
      // Deploy the contract and get signers
      const LendingContract = await ethers.getContractFactory("LendingContract");
      [owner, addr1] = await ethers.getSigners();
      lendingContract = await LendingContract.deploy();
      await lendingContract.deployed();
  
      // Create a request to be approved later in the tests
      await lendingContract.connect(addr1).createRequest(ethers.utils.parseEther("10"));
    });
  
    it("Owner should be able to approve a request", async function () {
      // Assume the first request ID is 1
      const requestId = 1;
  
      // Approve the request
      await lendingContract.connect(owner).approveRequest(requestId);
  
      // Fetch the updated request
      const request = await lendingContract.getRequest(requestId);
  
      // Assert the request is approved (assuming 'Approved' status is represented by '1')
      expect(request.status).to.equal(1); // Adjust the expected value according to your contract
    });
  
    it("Non-owner should not be able to approve a request", async function () {
      const requestId = 1;
  
      // Try to approve the request as a non-owner and expect it to be reverted
      await expect(lendingContract.connect(addr1).approveRequest(requestId))
        .to.be.revertedWith("Only the owner can perform this operation"); // Adjust the error message according to your contract
    });
  });