// migrations/2_deploy_contracts.js
const VaultRegistry = artifacts.require("VaultRegistry");

module.exports = function (deployer) {
  deployer.deploy(VaultRegistry);
};