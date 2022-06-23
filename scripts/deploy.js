const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const accounts = await hre.ethers.getSigners();
  const esdToken = await hre.ethers.getContractFactory('ESDToken');
  const ESDToken = await esdToken.deploy(10000, accounts[0].address);
  await ESDToken.deployed();

  console.log('Token deployed to:', ESDToken.address);

  const tokenAddress = ESDToken.address;
  const predictionMarket = await hre.ethers.getContractFactory(
    'PredictionMarket'
  );
  const PredictionMarket = await predictionMarket.deploy(
    accounts[1].address,
    tokenAddress
  );

  await PredictionMarket.deployed();

  console.log('Market deployed to:', PredictionMarket.address);

  const data = {
    address: PredictionMarket.address,
    abi: JSON.parse(PredictionMarket.interface.format('json'))
  };

  // console.log(data);

  fs.writeFileSync('frontend/src/PredictionMarket.json', JSON.stringify(data)); 

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
