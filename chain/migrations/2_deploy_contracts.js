const EthereumDIDRegistry = artifacts.require("EthereumDIDRegistry");
const Verifier = artifacts.require("Verifier");


module.exports = function(deployer) {
  deployer.deploy(EthereumDIDRegistry).then(function() {
    return deployer.deploy(Verifier, EthereumDIDRegistry.address);
  });
};
