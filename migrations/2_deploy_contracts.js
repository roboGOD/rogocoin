const RogoCoin = artifacts.require("./RogoCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(RogoCoin);
};
