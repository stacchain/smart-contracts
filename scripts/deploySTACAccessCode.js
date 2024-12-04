async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contract with account:", deployer.address);

  // Specify the access price in wei (e.g., 0.01 MATIC)
  const accessPriceInWei = ethers.utils.parseEther("0.01");

  // Compile and deploy the contract
  const AccessCodeContract = await ethers.getContractFactory("STACAccessCode");
  const accessCode = await AccessCodeContract.deploy(accessPriceInWei);

  await accessCode.deployed();

  console.log("STACAccessCode deployed to:", accessCode.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
