const { ethers } = require("ethers");

function isValidAddress(address) {
  return ethers.isAddress(address);
}

function formatWeiToEth(wei) {
  return ethers.formatEther(wei);
}

async function getTransaction(provider, txHash) {
  return await provider.getTransaction(txHash);
}

module.exports = { isValidAddress, formatWeiToEth, getTransaction };
