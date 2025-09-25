const { ethers } = require("ethers");
const { formatEther } = ethers;
const { isValidAddress, formatWeiToEth, getTransaction } = require('./utils');


class MyEthereumSDK {
  constructor(rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  // Get current block number
  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  // Get block details by number or hash
  async getBlock(blockId) {
    return await this.provider.getBlock(blockId);
  }

  // Get ETH balance of an address
  async getBalance(address) {
    const balance = await this.provider.getBalance(address);
    return formatEther(balance);
  }

  // Send a signed transaction (optional, advanced)
  async sendTransaction(signedTx) {
    const txResponse = await this.provider.sendTransaction(signedTx);
    return txResponse;
  }
}

module.exports = MyEthereumSDK;
