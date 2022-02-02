pragma solidity ^0.5.16;

/**
 * ERC-20: https://eips.ethereum.org/EIPS/eip-20
 */
contract RogoCoin {
  uint256 public totalSupply;
  string public name = "RogoCoin";
  string public symbol = "ROGO";
  string public standard = "RogoCoin v1.0";
  uint8 public decimals = 8;

  mapping(address => uint256) public balanceOf;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  constructor(uint256 _initialSupply) public {
    totalSupply = _initialSupply;
    balanceOf[msg.sender] = _initialSupply;
  }

  modifier hasBalance(uint256 value) {
    require(balanceOf[msg.sender] >= value, "Balance should be greater than transaction amount.");
    _;
  }

  function transfer(address _to, uint256 _value) public hasBalance(_value) returns (bool success) {
    address _from = msg.sender;
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(_from, _to, _value);
    return true;
  }
}
