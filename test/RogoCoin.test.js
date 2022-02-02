const { assert } = require("chai");

const RogoCoin = artifacts.require("./RogoCoin.sol");

const INIT_SUPPLY = 1000000;

contract("RogoCoin", (accounts) => {
  before(async () => {
    this.rogoCoin = await RogoCoin.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.rogoCoin.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("initializes the contract with the correct values", async () => {
    const name = await this.rogoCoin.name();
    const symbol = await this.rogoCoin.symbol();
    const standard = await this.rogoCoin.standard();
    const decimals = await this.rogoCoin.decimals();
    assert.equal(name, "RogoCoin", "has the correct name");
    assert.equal(symbol, "ROGO", "has the correct symbol");
    assert.equal(standard, "RogoCoin v1.0", "has the correct standard");
    assert.equal(decimals, 8, "has the correct decimals");
  });

  it("sets totalSupply on deployment", async () => {
    const totalSupply = await this.rogoCoin.totalSupply();
    assert.equal(totalSupply.toNumber(), INIT_SUPPLY);
  });

  it("allocates the initial supply to admin", async () => {
    const adminBalance = await this.rogoCoin.balanceOf(accounts[0]);
    assert.equal(adminBalance.toNumber(), INIT_SUPPLY);
  });

  it("transfers token ownership", async () => {
    const REVERT_MESSAGE =
      "Transaction must be reverted if the message caller's account balance does not have enough tokens to spend.";
    try {
      const response = await this.rogoCoin.transfer.call(
        accounts[1],
        999999999999999,
        { from: accounts[0] }
      );
      assert.fail(REVERT_MESSAGE);
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, REVERT_MESSAGE);
    }

    const TRANSFER_AMOUNT = 250;
    assert.equal(
      (await this.rogoCoin.balanceOf(accounts[1])).toNumber(),
      0,
      "initial balance of receiver should be 0"
    );
    const receipt = await this.rogoCoin.transfer(accounts[1], TRANSFER_AMOUNT, {
      from: accounts[0],
    });
    assert.equal(
      (await this.rogoCoin.balanceOf(accounts[1])).toNumber(),
      TRANSFER_AMOUNT,
      "balance of receiver after transaction should be " + TRANSFER_AMOUNT
    );
    assert.equal(
      (await this.rogoCoin.balanceOf(accounts[0])).toNumber(),
      INIT_SUPPLY - TRANSFER_AMOUNT,
      "balance of receiver after transaction should be " +
        INIT_SUPPLY -
        TRANSFER_AMOUNT
    );

    assert.equal(receipt.logs.length, 1, "emits single event");
    const event = receipt.logs[0].args;
    assert.equal(accounts[0], event._from, "emits the correct sender address");
    assert.equal(accounts[1], event._to, "emits the correct receiver address");
    assert.equal(TRANSFER_AMOUNT, event._value, "emits the correct amount");

    const success = await this.rogoCoin.transfer.call(
      accounts[1],
      TRANSFER_AMOUNT,
      { from: accounts[0] }
    );
    assert.equal(success, true, 'transfer must returns boolean');
  });
});
