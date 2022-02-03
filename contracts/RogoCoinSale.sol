pragma solidity ^0.5.16;
import "./RogoCoin.sol";

contract RogoCoinSale {
  address admin;
  RogoCoin public tokenContract;
  uint256 public tokenPrice;

  constructor(RogoCoin _tokenContract, uint256 _tokenPrice) public {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
