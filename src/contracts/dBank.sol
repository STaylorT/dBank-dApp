// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  //assign Token contract to variable
  Token private token;

  //add mappings
  // user bank acct,
  mapping(address => uint) public etherBalanceOf;

  // 
  mapping(address => uint) public depositStart;

  // 
  mapping(address => bool) public isDeposited;

  //add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint userBalance, uint timeStart, uint interest);

  //pass as constructor argument deployed Token contract

  constructor(Token _token) public {
    //assign token deployed contract to variable
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    require(isDeposited[msg.sender] == false, 'Error, deposit already active');

    //check if msg.value is >= 0.01 ETH
    require(msg.value >= 1e16, 'Error, deposit must be >= .01 Eth.');

    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

    // start time of deposited funds
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

    // whether or not this user has deposited
    isDeposited[msg.sender] = true;

    // emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    require(isDeposited[msg.sender] == true);
    //assign msg.sender ether deposit balance to variable for event
    uint userBalance = etherBalanceOf[msg.sender];

    //check user's hodl time
    uint holdTime =  block.timestamp - depositStart[msg.sender];

    //calc interest per second
    uint interestPerSec = 31668017 * (etherBalanceOf[msg.sender] / 1e16);

    //calc accrued interest
    uint interest = interestPerSec * holdTime;

    //send eth in [user acct] back to to user
    msg.sender.transfer(etherBalanceOf[msg.sender]);

    //mint token that will be interest for user and send
    token.mint(msg.sender, interest);


    //reset depositer data after withdrawl
    etherBalanceOf[msg.sender] = 0;
    depositStart[msg.sender] = 0;
    isDeposited[msg.sender] = false;

    //emit event
    emit Withdraw(msg.sender, userBalance, depositStart[msg.sender], interest);
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}