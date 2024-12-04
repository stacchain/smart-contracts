async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying STACToken with the account:", deployer.address);
  
    // Compile and deploy the token contract
    const TokenContract = await ethers.getContractFactory("STACToken");
    const token = await TokenContract.deploy();
  
    await token.deployed();
  
    console.log("STACToken deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  