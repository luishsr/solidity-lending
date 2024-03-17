import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LendingContract - Request Creation", function () {
  let lendingContract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const LendingContract = await ethers.getContractFactory("LendingContract");
    [owner, addr1] = await ethers.getSigners();

    lendingContract = await LendingContract.deploy();
    await lendingContract.deployed();
  });

  describe("createRequest", function () {
    it("Should emit RequestCreated with correct parameters", async function () {
      const amount = ethers.utils.parseEther("10"); // 10 ETH
      await expect(lendingContract.connect(addr1).createRequest(amount))
        .to.emit(lendingContract, "RequestCreated")
        .withArgs(addr1.address, amount);

      // Verify the state changes appropriately.
      const requestCount = await lendingContract.requestCount();
      expect(requestCount).to.equal(1);

      const request = await lendingContract.getRequest(1);
      expect(request.requester).to.equal(addr1.address);
      expect(request.amount).to.equal(amount);
      expect(request.status).to.equal(0); // Check if the status is 'Open'
    });

    it("Should revert if the amount is less than 10 ETH", async function () {
      const amount = ethers.utils.parseEther("1"); // 1 ETH
      await expect(lendingContract.connect(addr1).createRequest(amount)).to.be.revertedWith(
        "Minimum required amount is 10 ETH"
      );
    });
  });
});
