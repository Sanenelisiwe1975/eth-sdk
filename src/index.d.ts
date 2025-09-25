import { JsonRpcProvider, Wallet, Contract } from "ethers";

export interface WalletInfo {
  address: string;
  mnemonic: string | null;
  privateKey: string;
}

export interface BatchRequest {
  method: string;
  params: any[];
}

export declare class MyEthereumSDK {
  constructor(rpcUrl: string);
  provider: JsonRpcProvider;

  getBlockNumber(): Promise<number>;
  getBlock(blockId: string | number): Promise<any>;
  getBalance(address: string): Promise<string>;
  sendTransaction(signedTx: string): Promise<any>;

  createWallet(): WalletInfo;
  importWalletFromMnemonic(mnemonic: string): WalletInfo;
  importWalletFromPrivateKey(privateKey: string): WalletInfo;

  setSecureKey(privateKey: string): void;
  getSecureKey(): string;

  signTransaction(walletPrivateKey: string, txData: any): Promise<any>;
  deployContract(walletPrivateKey: string, abi: any[], bytecode: string, constructorArgs?: any[]): Promise<any>;
  getContract(address: string, abi: any[]): Contract;

  onNewBlock(callback: (blockNumber: number) => void): void;
  onContractEvent(contractAddress: string, abi: any[], eventName: string, callback: (...args: any[]) => void): void;

  // Testing Utilities
  static getMockProvider(): JsonRpcProvider;
  static getMockWallet(): Wallet;

  batchRequests(requests: BatchRequest[]): Promise<any[]>;
  getBalanceCached(address: string): Promise<string>;

  static isBrowser(): boolean;
  static isNode(): boolean;

  setNetwork(rpcUrl: string): void;
  getNetwork(): Promise<any>;

  resolveENS(name: string): Promise<string | { error: string }>;
  lookupAddress(address: string): Promise<string | { error: string }>;

  onNewTransaction(callback: (tx: any) => void): void;
  onContractAllEvents(contractAddress: string, abi: any[], callback: (...args: any[]) => void): void;
}