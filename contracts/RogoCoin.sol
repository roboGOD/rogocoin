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

  mapping(address => mapping (address => uint256)) public allowance;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  constructor(uint256 _initialSupply) public {
    totalSupply = _initialSupply;
    balanceOf[msg.sender] = _initialSupply;
  }

  modifier hasBalance(address sender, uint256 value) {
    require(balanceOf[sender] >= value, "Balance should be greater than transaction amount.");
    _;
  }

  modifier minimumAllowance(address owner, address spender, uint256 value) {
    require(allowance[owner][spender] >= value, "Allowance should be greater than transaction amount.");
    _;
  }

  function transfer(address _to, uint256 _value) public hasBalance(msg.sender, _value) returns (bool success) {
    address _from = msg.sender;
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    emit Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    address _owner = msg.sender;

    allowance[_owner][_spender] = _value;

    emit Approval(_owner, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public 
    hasBalance(_from, _value) 
    minimumAllowance(_from, msg.sender, _value) 
    returns (bool success) {
    address _spender = msg.sender;

    // Perform the transer
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    // Deduct the allowance
    allowance[_from][_spender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
  }
}
