const LACChainDIDRegistry = artifacts.require("./LACChainDIDRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(LACChainDIDRegistry);
};
