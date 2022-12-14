import { ethers } from 'hardhat';
import console from 'console';

const _metadataUri = 'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';

async function deploy(name: string, ...params: [string]) {
  const contractFactory = await ethers.getContractFactory(name);

  return await contractFactory.deploy(...params).then((f) => f.deployed());
}

const AzureBlockchainStorage = artifacts.require('AzureBlockchainStorage');

module.exports = (deployer) => {
    deployer.deploy(AzureBlockchainStorage);
};

async function main() {
  const [admin] = await ethers.getSigners();
  
  console.log(`Deploying a smart contract...`);

  const GameCrypt = (await deploy('GameCrypt', _metadataUri)).connect(admin);

  console.log({ GameCrypt: GameCrypt.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
