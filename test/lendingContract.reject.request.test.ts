import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LendingContract - Request Rejection", function () {
  let lendingContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    // Deploy the LendingContract
    const LendingContract = await ethers.getContractFactory("LendingContract");
    [owner, addr1] = await ethers.getSigners();
    lendingContract = await LendingContract.deploy();
    await lendingContract.deployed();
  });

  it("Owner should be able to reject a request", async function () {
    // Create a request first
    const amount = ethers.utils.parseEther("10");
    await lendingContract.connect(addr1).createRequest(amount);

    // Now, try to reject the request (assuming ID is 1 for the first request)
    await expect(lendingContract.connect(owner).rejectRequest(1))
      .to.emit(lendingContract, "RequestRejected")
      .withArgs(1);

    // Verify the request's status is now 'Rejected'
    const request = await lendingContract.getRequest(1);
    expect(request.status).to.equal(2); // Assuming 'Rejected' is represented by 2 in the enum
  });

  it("Non-owner should not be able to reject a request", async function () {
    // Create a request first
    const amount = ethers.utils.parseEther("10");
    await lendingContract.connect(addr1).createRequest(amount);

    // Attempt to reject the request as a non-owner, expecting it to revert
    await expect(lendingContract.connect(addr1).rejectRequest(1))
      .to.be.revertedWith("Only the owner can perform this operation");
  });
});
