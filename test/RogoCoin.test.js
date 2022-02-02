const { assert } = require("chai");

const RogoCoin = artifacts.require('./RogoCoin.sol');

contract('RogoCoin', (accounts) => {
  before(async () => {
    this.rogoCoin = await RogoCoin.deployed();
  });

  it('deploys successfully', async () => {
    const address = await this.rogoCoin.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it('get totalSupply', async () => {
    const totalSupply = await this.rogoCoin.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000);
  });

  it('set totalSupply', async () => {
    const result = await this.rogoCoin.setTotalSupply(2000000);
    const totalSupply = await this.rogoCoin.totalSupply();
    assert.equal(totalSupply.toNumber(), 2000000);
    const event = result.logs[0].args;
    assert.equal(event.totalSupply.toNumber(), 2000000);
  });
})