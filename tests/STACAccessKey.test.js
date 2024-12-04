const { expect } = require("chai");

describe("STACAccessKey Contract", function () {
  let AccessKeyContract, accessKey;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract with a key price of 0.01 ETH
    const keyPriceInWei = ethers.utils.parseEther("0.01");
    AccessKeyContract = await ethers.getContractFactory("STACAccessKey");
    accessKey = await AccessKeyContract.deploy(keyPriceInWei);

    await accessKey.deployed();
  });

  it("Should set the correct owner and key price", async function () {
    expect(await accessKey.owner()).to.equal(owner.address);
    expect(await accessKey.keyPrice()).to.equal(ethers.utils.parseEther("0.01"));
  });

  it("Should allow a user to purchase an access key", async function () {
    const keyPriceInWei = await accessKey.keyPrice();

    // User1 purchases an access key
    const tx = await accessKey.connect(user1).purchaseAccess({
      value: keyPriceInWei,
    });
    await tx.wait();

    // Check that user1 now has access
    const accessKeyForUser1 = await accessKey.accessKeys(user1.address);
    expect(accessKeyForUser1).to.not.equal("");
    expect(await accessKey.validKeys(accessKeyForUser1)).to.equal(true);
  });

  it("Should not allow a user to purchase access without enough payment", async function () {
    await expect(
      accessKey.connect(user1).purchaseAccess({
        value: ethers.utils.parseEther("0.005"), // Less than the key price
      })
    ).to.be.revertedWith("Incorrect amount sent");
  });

  it("Should not allow a user to purchase access twice", async function () {
    const keyPriceInWei = await accessKey.keyPrice();

    // User1 purchases an access key
    await accessKey.connect(user1).purchaseAccess({
      value: keyPriceInWei,
    });

    // Attempt to purchase again
    await expect(
      accessKey.connect(user1).purchaseAccess({
        value: keyPriceInWei,
      })
    ).to.be.revertedWith("You already have access");
  });

  it("Should allow the owner to revoke access", async function () {
    const keyPriceInWei = await accessKey.keyPrice();

    // User1 purchases an access key
    await accessKey.connect(user1).purchaseAccess({
      value: keyPriceInWei,
    });

    // Owner revokes access for user1
    const user1Key = await accessKey.accessKeys(user1.address);
    await accessKey.connect(owner).revokeAccess(user1.address);

    // Check that the key is no longer valid
    expect(await accessKey.validKeys(user1Key)).to.equal(false);
    expect(await accessKey.accessKeys(user1.address)).to.equal("");
  });

  it("Should allow the owner to update the key price", async function () {
    const newKeyPriceInWei = ethers.utils.parseEther("0.02");

    // Update the key price
    await accessKey.connect(owner).updateKeyPrice(newKeyPriceInWei);

    // Verify the key price has been updated
    expect(await accessKey.keyPrice()).to.equal(newKeyPriceInWei);
  });

  it("Should not allow non-owner to update the key price", async function () {
    const newKeyPriceInWei = ethers.utils.parseEther("0.02");

    await expect(
      accessKey.connect(user1).updateKeyPrice(newKeyPriceInWei)
    ).to.be.revertedWith("Only owner can call this function");
  });
});
