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

  // Securely store a private key in memory (simple demo, not for production)
  #secureKey = null;
  setSecureKey(privateKey) {
    if (!ethers.isHexString(privateKey) || privateKey.length !== 66) {
      throw new Error("Invalid private key format");
    }
    this.#secureKey = privateKey;
  }
  getSecureKey() {
    if (!this.#secureKey) {
      throw new Error("No private key stored");
    }
    return this.#secureKey;
  }

  // Sign a transaction
  async signTransaction(walletPrivateKey, txData) {
    try {
      this.validateTransactionData(txData);
      const wallet = new ethers.Wallet(walletPrivateKey, this.provider);
      const txResponse = await wallet.sendTransaction(txData);
      return txResponse;
    } catch (error) {
      return { error: error.message };
    }
  }

  // Deploy a smart contract
  async deployContract(walletPrivateKey, abi, bytecode, constructorArgs = []) {
    try {
      const wallet = new ethers.Wallet(walletPrivateKey, this.provider);
      const factory = new ethers.ContractFactory(abi, bytecode, wallet);
      const contract = await factory.deploy(...constructorArgs);
      await contract.deploymentTransaction().wait();
      return contract;
    } catch (error) {
      return { error: error.message };
    }
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

  // --- Testing Utilities ---
  // Mock provider for testing
  static getMockProvider() {
    return new ethers.JsonRpcProvider();
  }

  // Helper to mock wallet for testing
  static getMockWallet() {
    return ethers.Wallet.createRandom();
  }

  // --- Performance Optimization ---
  // Batch multiple RPC calls
  async batchRequests(requests) {
    // requests: array of { method, params }
    const batch = requests.map(({ method, params }) => ({ method, params }));
    // ethers.js does not natively support batch, so use Promise.all
    return await Promise.all(batch.map(r => this.provider[r.method](...r.params)));
  }

  // Simple in-memory cache for getBalance
  #balanceCache = {};
  async getBalanceCached(address) {
    if (this.#balanceCache[address]) {
      return this.#balanceCache[address];
    }
    const balance = await this.getBalance(address);
    this.#balanceCache[address] = balance;
    return balance;
  }

  // --- Compatibility ---
  static isBrowser() {
    return (typeof window !== "undefined" && typeof window.document !== "undefined");
  }

  static isNode() {
    return (typeof process !== "undefined" && process.versions != null && process.versions.node != null);
  }

  // --- Network Support ---
  setNetwork(rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  getNetwork() {
    return this.provider.getNetwork();
  }

  // --- ENS Integration ---
  async resolveENS(name) {
    try {
      return await this.provider.resolveName(name);
    } catch (error) {
      return { error: error.message };
    }
  }

  async lookupAddress(address) {
    try {
      return await this.provider.lookupAddress(address);
    } catch (error) {
      return { error: error.message };
    }
  }

  // --- Enhanced Event Subscription ---
  onNewTransaction(callback) {
    this.provider.on('pending', callback);
  }

  onContractAllEvents(contractAddress, abi, callback) {
    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    contract.on('*', callback);
  }

  
}

module.exports = MyEthereumSDK;