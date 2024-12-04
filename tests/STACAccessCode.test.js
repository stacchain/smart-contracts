const { expect } = require("chai");

describe("STACAccessCode Contract", function () {
  let AccessCodeContract, accessCode;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract with an access price of 0.01 MATIC
    const accessPriceInWei = ethers.utils.parseEther("0.01");
    AccessCodeContract = await ethers.getContractFactory("STACAccessCode");
    accessCode = await AccessCodeContract.deploy(accessPriceInWei);

    await accessCode.deployed();
  });

  it("Should set the correct owner and access price", async function () {
    expect(await accessCode.owner()).to.equal(owner.address);
    expect(await accessCode.accessPrice()).to.equal(
      ethers.utils.parseEther("0.01")
    );
  });

  it("Should allow a user to purchase an access code", async function () {
    const accessPriceInWei = await accessCode.accessPrice();

    // User1 purchases an access code
    const tx = await accessCode.connect(user1).purchaseAccessCode({
      value: accessPriceInWei,
    });
    const receipt = await tx.wait();

    // AccessCodeGenerated event should be emitted
    const event = receipt.events.find((e) => e.event === "AccessCodeGenerated");
    expect(event.args.user).to.equal(user1.address);

    // Access data should be stored
    const storedData = await accessCode.accessRecords(user1.address);
    expect(storedData.expiryTime).to.be.above(0);
    expect(storedData.hashedCode).to.not.equal("0x");
  });

  it("Should not allow a user to purchase without enough payment", async function () {
    await expect(
      accessCode.connect(user1).purchaseAccessCode({
        value: ethers.utils.parseEther("0.005"), // Less than the access price
      })
    ).to.be.revertedWith("Incorrect payment amount");
  });

  it("Should not allow a user to purchase access twice", async function () {
    const accessPriceInWei = await accessCode.accessPrice();

    // User1 purchases an access code
    await accessCode.connect(user1).purchaseAccessCode({
      value: accessPriceInWei,
    });

    // Attempt to purchase again
    await expect(
      accessCode.connect(user1).purchaseAccessCode({
        value: accessPriceInWei,
      })
    ).to.be.revertedWith("Access already purchased");
  });

  it("Should validate a correct access code", async function () {
    const accessPriceInWei = await accessCode.accessPrice();

    // User1 purchases an access code
    const tx = await accessCode.connect(user1).purchaseAccessCode({
      value: accessPriceInWei,
    });
    const receipt = await tx.wait();

    // Extract the access code hash from the event
    const event = receipt.events.find((e) => e.event === "AccessCodeGenerated");
    const expiryTime = event.args.expiryTime;

    // Verify the code (mocking an external system's request)
    const accessCode = "mocked-access-code"; // Simulating the access code returned
    const hashedCode = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(accessCode)
    );
    expect(
      await accessCode.verifyAccessCode(user1.address, accessCode)
    ).to.equal(true);

    // Check expiry
    expect(expiryTime).to.be.above(Date.now() / 1000);
  });

  it("Should revoke access for a user", async function () {
    const accessPriceInWei = await accessCode.accessPrice();

    // User1 purchases an access code
    await accessCode.connect(user1).purchaseAccessCode({
      value: accessPriceInWei,
    });

    // Revoke access
    await accessCode.connect(owner).revokeAccess(user1.address);

    // Verify that access is revoked
    const storedData = await accessCode.accessRecords(user1.address);
    expect(storedData.expiryTime).to.equal(0);
    expect(storedData.hashedCode).to.equal("0x");
  });

  it("Should allow the owner to update the access price", async function () {
    const newAccessPriceInWei = ethers.utils.parseEther("0.02");

    // Update the access price
    await accessCode.connect(owner).updateAccessPrice(newAccessPriceInWei);

    // Verify the new access price
    expect(await accessCode.accessPrice()).to.equal(newAccessPriceInWei);
  });

  it("Should not allow non-owner to update the access price", async function () {
    const newAccessPriceInWei = ethers.utils.parseEther("0.02");

    await expect(
      accessCode.connect(user1).updateAccessPrice(newAccessPriceInWei)
    ).to.be.revertedWith("Only the owner can call this function");
  });

  it("Should allow the owner to withdraw funds", async function () {
    const accessPriceInWei = await accessCode.accessPrice();

    // User1 purchases an access code
    await accessCode.connect(user1).purchaseAccessCode({
      value: accessPriceInWei,
    });

    // Record owner's balance before withdrawal
    const balanceBefore = await ethers.provider.getBalance(owner.address);

    // Withdraw funds
    const tx = await accessCode.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    // Verify the balance after withdrawal
    const balanceAfter = await ethers.provider.getBalance(owner.address);
    expect(balanceAfter).to.equal(
      balanceBefore.add(accessPriceInWei).sub(gasUsed)
    );
  });
});
