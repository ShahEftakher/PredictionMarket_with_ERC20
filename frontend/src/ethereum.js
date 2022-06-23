import PredictionMarket from './PredictionMarket.json';
import { ethers, Contract } from 'ethers';

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log(PredictionMarket.address);
        const predictionMarket = new Contract(
          PredictionMarket.address,
          PredictionMarket.abi,
          signer
        );

        resolve({ signerAddress, predictionMarket });
      }
    });
  });

export default getBlockchain;
