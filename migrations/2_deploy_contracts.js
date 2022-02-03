const RogoCoin = artifacts.require("./RogoCoin.sol");
const RogoCoinSale = artifacts.require("./RogoCoinSale.sol");

const INIT_SUPPLY = 1000000;
const TOKEN_PRICE = 1000000000000000; // wei

module.exports = function(deployer) {
  deployer.deploy(RogoCoin, INIT_SUPPLY).then(() => {
    return deployer.deploy(RogoCoinSale, RogoCoin.address, TOKEN_PRICE);
  });
};
