# MyEthereumSDK

A simple JavaScript SDK for interacting with Ethereum nodes via RPC.

## Installation

```bash
npm install eth-sdk
```

## Usage

```javascript
const MyEthereumSDK = require('eth-sdk');
const sdk = new MyEthereumSDK('https://rpc.ethereum.org');

// Example: Get current block number
sdk.getBlockNumber().then(blockNumber => {
  console.log('Current block number:', blockNumber);
});
```

## License

MIT License.
