const RogoCoin = artifacts.require("./RogoCoin.sol");

const INIT_SUPPLY = 1000000;

module.exports = function(deployer) {
  deployer.deploy(RogoCoin, INIT_SUPPLY);
};
