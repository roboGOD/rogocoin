pragma solidity ^0.5.16;

contract RogoCoin {
  // Constructor
  // Set the total number of tokens
  // Read the total number of tokens 
  uint256 public totalSupply;

  event TotalSupplyUpdated(
    uint256 totalSupply
  );

  constructor() public {
    totalSupply = 1000000;
  }

  function setTotalSupply(uint256 _totalSupply) public {
    totalSupply = _totalSupply;
    emit TotalSupplyUpdated(totalSupply);
  }
}
