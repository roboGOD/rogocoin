const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-as-promised"));

const RogoCoinSale = artifacts.require("./RogoCoinSale.sol");

contract("RogoCoinSale", (accounts) => {

  const TOKEN_PRICE = 1000000000000000; // wei

  before(async () => {
    this.rogoCoinSale = await RogoCoinSale.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.rogoCoinSale.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("has a token contract", async () => {
    const address = await this.rogoCoinSale.tokenContract();
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("has correct price", async () => {
    const tokenPrice = await this.rogoCoinSale.tokenPrice();
    assert.equal(tokenPrice, TOKEN_PRICE, "price must be " + TOKEN_PRICE + " wei");
  });

});
