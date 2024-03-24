const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending Contract Tests", function () {
    let Lending;
    let lending;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Lending = await ethers.getContractFactory("Lending");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy a new Lending contract before each test.
        lending = await Lending.deploy();
    });

    describe("Deployment", function () {
        // Test case for contract deployment and owner assignment.
        it("Should set the right owner", async function () {
            expect(await lending.getOwner()).to.equal(owner.address);
        });
    });

    describe("submitRequest", function () {
        // Test case for submitting a lending request successfully.
        it("Should emit LendingRequestSubmitted event", async function () {
            await expect(lending.connect(addr1).submitRequest(100))
                .to.emit(lending, "LendingRequestSubmitted")
                .withArgs(addr1.address, 100);
        });

        // Test case for revert if amount is less than 1.
        it("Should fail if amount is less than 1", async function () {
            await expect(lending.connect(addr1).submitRequest(0))
                .to.be.revertedWith("Lending_AmountMustBeGreaterThanZero");
        });
    });

    describe("findRequestById", function () {
        // Test case for finding a request by ID.
        it("Should find a request by ID", async function () {
            await lending.connect(addr1).submitRequest(100);
            let request = await lending.findRequestById(1);
            expect(request.amount).to.equal(100);
        });
    });

    describe("approveRequest", function () {
        // Test case for approving a request.
        it("Should allow the owner to approve a request", async function () {
            await lending.connect(addr1).submitRequest(100);
            await expect(lending.connect(owner).approveRequest(1))
                .to.emit(lending, "LendingRequestApproved")
                .withArgs(1);
        });

        // Test case to ensure only the owner can approve requests.
        it("Should fail if a non-owner tries to approve a request", async function () {
            await lending.connect(addr1).submitRequest(100);
            await expect(lending.connect(addr1).approveRequest(1))
                .to.be.revertedWith("Lending_OnlyOwnerCanPerformOperation");
        });
    });

    describe("rejectRequest", function () {
        // Test case for rejecting a request.
        it("Should allow the owner to reject a request", async function () {
            await lending.connect(addr1).submitRequest(100);
            await expect(lending.connect(owner).rejectRequest(1))
                .to.emit(lending, "LendingRequestRejected")
                .withArgs(1);
        });

        // Test case to ensure only the owner can reject requests.
        it("Should fail if a non-owner tries to reject a request", async function () {
            await lending.connect(addr1).submitRequest(100);
            await expect(lending.connect(addr1).rejectRequest(1))
                .to.be.revertedWith("Lending_OnlyOwnerCanPerformOperation");
        });
    });

    // Additional tests can be added for different scenarios and edge cases.
});
