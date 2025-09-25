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

  // Create a new wallet
  createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : null,
      privateKey: wallet.privateKey
    };
  }

  // Import wallet from mnemonic
  importWalletFromMnemonic(mnemonic) {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : null,
      privateKey: wallet.privateKey
    };
  }

  // Import wallet from private key
  importWalletFromPrivateKey(privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : null,
      privateKey: wallet.privateKey
    };
  }

  // Sign a transaction
  async signTransaction(walletPrivateKey, txData) {
    const wallet = new ethers.Wallet(walletPrivateKey, this.provider);
    const txResponse = await wallet.sendTransaction(txData);
    return txResponse;
  }

  // Deploy a smart contract
  async deployContract(walletPrivateKey, abi, bytecode, constructorArgs = []) {
    const wallet = new ethers.Wallet(walletPrivateKey, this.provider);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(...constructorArgs);
    await contract.deploymentTransaction().wait();
    return contract;
  }

  // Interact with a smart contract
  getContract(address, abi) {
    return new ethers.Contract(address, abi, this.provider);
  }

  // Subscribe to new blocks
  onNewBlock(callback) {
    this.provider.on('block', callback);
  }

  // Subscribe to contract events
  onContractEvent(contractAddress, abi, eventName, callback) {
    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    contract.on(eventName, callback);
  }
}

module.exports = MyEthereumSDK;