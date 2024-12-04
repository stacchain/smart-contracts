async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contract with account:", deployer.address);
  
    // Specify the key price in wei (e.g., 0.01 MATIC)
    const keyPriceInWei = ethers.utils.parseEther("0.01");
  
    // Compile and deploy the contract
    const AccessKeyContract = await ethers.getContractFactory("STACAccessKey");
    const accessKey = await AccessKeyContract.deploy(keyPriceInWei);
  
    await accessKey.deployed();
  
    console.log("STACAccessKey deployed to:", accessKey.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  