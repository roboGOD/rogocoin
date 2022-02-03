const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-as-promised"));

const RogoCoin = artifacts.require("./RogoCoin.sol");

contract("RogoCoin", (accounts) => {
  const INIT_SUPPLY = 1000000;
  const ALLOWANCE = 2000;
  const TRANSFER_AMOUNT = 250;

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
      "balance of sender after transaction should be " +
        INIT_SUPPLY -
        TRANSFER_AMOUNT
    );

    assert.equal(receipt.logs.length, 1, "emits single event");
    assert.equal(receipt.logs[0].event, "Transfer", "emits the Transfer event");
    const event = receipt.logs[0].args;
    assert.equal(accounts[0], event._from, "emits the correct sender address");
    assert.equal(accounts[1], event._to, "emits the correct receiver address");
    assert.equal(TRANSFER_AMOUNT, event._value, "emits the correct amount");
  });

  it("transfer returns boolean", async () => {
    const success = await this.rogoCoin.transfer.call(
      accounts[1],
      TRANSFER_AMOUNT,
      { from: accounts[0] }
    );
    assert.equal(success, true, "transfer must return boolean");
  });

  it("failed transfer transaction should be reverted", async () => {
    const REVERT_MESSAGE =
      "Transaction must be reverted if the message caller's account balance does not have enough tokens to spend.";
    try {
      const response = await this.rogoCoin.transfer.call(
        accounts[1],
        999999999999999,
        { from: accounts[0] }
      );
      assert.fail(0, 1, REVERT_MESSAGE);
    } catch (error) {
      assert(error.message.indexOf("revert") >= 0, REVERT_MESSAGE);
    }
  });

  it("initial allowance must be 0", async () => {
    const allowance = await this.rogoCoin.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 0, "initial allowance must be 0");
  });

  it("approves tokens for delegated transfer", async () => {
    const success = await this.rogoCoin.approve.call(accounts[1], ALLOWANCE, {
      from: accounts[0],
    });
    assert.equal(success, true, "approve must return true");
  });

  it("emits Approval event", async () => {
    const receipt = await this.rogoCoin.approve(accounts[1], ALLOWANCE, {
      from: accounts[0],
    });
    assert.equal(receipt.logs.length, 1, "emits single event");
    assert.equal(
      receipt.logs[0].event,
      "Approval",
      "must be the 'Approval' event"
    );
    const event = receipt.logs[0].args;
    assert.equal(accounts[0], event._owner, "emits the correct owner address");
    assert.equal(
      accounts[1],
      event._spender,
      "emits the correct spender address"
    );
    assert.equal(ALLOWANCE, event._value, "emits the correct allowance");

    const allowance = await this.rogoCoin.allowance(accounts[0], accounts[1]);
    assert.equal(
      allowance.toNumber(),
      ALLOWANCE,
      "allowance must be " + ALLOWANCE
    );
  });

  it("handles the successful delegated transfer", async () => {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spenderAccount = accounts[4];

    const initSupply = await this.rogoCoin.transfer(fromAccount, 10000, {
      from: accounts[0],
    });
    const approved = await this.rogoCoin.approve(spenderAccount, ALLOWANCE, {
      from: fromAccount,
    });
    const success = await this.rogoCoin.transferFrom.call(
      fromAccount,
      toAccount,
      TRANSFER_AMOUNT,
      { from: spenderAccount }
    ); 
    assert.equal(success, true, "transferFrom returns a boolean");

    const delegatedTransfer = await this.rogoCoin.transferFrom(
      fromAccount,
      toAccount,
      TRANSFER_AMOUNT,
      { from: spenderAccount }
    );

    const receiverBalance = await this.rogoCoin.balanceOf(toAccount);
    assert.equal(
      receiverBalance.toNumber(),
      TRANSFER_AMOUNT,
      "Receiver balance must equal the transfer amount"
    );
    const ownerBalance = await this.rogoCoin.balanceOf(fromAccount);
    assert.equal(
      ownerBalance.toNumber(),
      10000 - TRANSFER_AMOUNT,
      "Owner balance must equal " + 10000 - TRANSFER_AMOUNT
    );
    const allowance = await this.rogoCoin.allowance(fromAccount, spenderAccount);
    assert.equal(
      allowance.toNumber(),
      ALLOWANCE-TRANSFER_AMOUNT,
      `allowance must be ${ALLOWANCE-TRANSFER_AMOUNT} after the transfer`
    );
  });
  
  it("transferFrom emits the Transfer event", async () => {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spenderAccount = accounts[4];

    const initSupply = await this.rogoCoin.transfer(fromAccount, 10000, {
      from: accounts[0],
    });
    const approved = await this.rogoCoin.approve(spenderAccount, ALLOWANCE, {
      from: fromAccount,
    });
    const receipt = await this.rogoCoin.transferFrom(
      fromAccount,
      toAccount,
      TRANSFER_AMOUNT,
      { from: spenderAccount }
    );

    assert.equal(receipt.logs.length, 1, "emits single event");
    assert.equal(receipt.logs[0].event, "Transfer", "emits the Transfer event");
    const event = receipt.logs[0].args;
    assert.equal(fromAccount, event._from, "emits the correct sender address");
    assert.equal(toAccount, event._to, "emits the correct receiver address");
    assert.equal(TRANSFER_AMOUNT, event._value, "emits the correct amount");
  });

  it("transferFrom throws error on failed transaction", async () => {
    const fromAccount = accounts[2];
    const toAccount = accounts[3];
    const spenderAccount = accounts[4];

    const initSupply = await this.rogoCoin.transfer(fromAccount, 10000, {
      from: accounts[0],
    });
    const approved = await this.rogoCoin.approve(spenderAccount, ALLOWANCE, {
      from: fromAccount,
    });

    const REVERT_MESSAGE = "Transaction must be reverted if allowance is less than transfer amount";
    try {
      await expect(
        this.rogoCoin.transferFrom(
          fromAccount,
          toAccount,
          2*ALLOWANCE,
          { from: spenderAccount }
        )
      ).to.be.rejectedWith(Error);
    } catch (error) {
      console.log("ERROR IS: ", error.message);
      assert(error.message.indexOf("revert") >= 0, REVERT_MESSAGE);
    }
  });
});
