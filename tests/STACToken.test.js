const { expect } = require("chai");

describe("STACToken Contract", function () {
  let TokenContract, token, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the token contract
    TokenContract = await ethers.getContractFactory("STACToken");
    token = await TokenContract.deploy();
    await token.deployed();
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const totalSupply = await token.totalSupply();

    expect(ownerBalance).to.equal(totalSupply);
  });

  it("Should allow token transfers", async function () {
    const transferAmount = ethers.utils.parseEther("100");

    // Transfer tokens from owner to user1
    await token.transfer(user1.address, transferAmount);

    const user1Balance = await token.balanceOf(user1.address);
    expect(user1Balance).to.equal(transferAmount);
  });

  it("Should fail if sender doesn't have enough balance", async function () {
    const transferAmount = ethers.utils.parseEther("100");

    // Attempt to transfer more than user1's balance
    await expect(
      token.connect(user1).transfer(user2.address, transferAmount)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should allow token approvals and transfers via transferFrom", async function () {
    const transferAmount = ethers.utils.parseEther("50");

    // Approve user1 to spend owner's tokens
    await token.approve(user1.address, transferAmount);

    const allowance = await token.allowance(owner.address, user1.address);
    expect(allowance).to.equal(transferAmount);

    // Transfer tokens from owner to user2 via user1
    await token.connect(user1).transferFrom(owner.address, user2.address, transferAmount);

    const user2Balance = await token.balanceOf(user2.address);
    expect(user2Balance).to.equal(transferAmount);

    const remainingAllowance = await token.allowance(owner.address, user1.address);
    expect(remainingAllowance).to.equal(0);
  });

  it("Should update balances and allowances correctly after transferFrom", async function () {
    const transferAmount = ethers.utils.parseEther("30");

    // Approve and perform transferFrom
    await token.approve(user1.address, transferAmount);
    await token.connect(user1).transferFrom(owner.address, user2.address, transferAmount);

    // Check balances
    const ownerBalance = await token.balanceOf(owner.address);
    const user2Balance = await token.balanceOf(user2.address);

    expect(ownerBalance).to.equal(
      (await token.totalSupply()).sub(user2Balance)
    );
  });
});
