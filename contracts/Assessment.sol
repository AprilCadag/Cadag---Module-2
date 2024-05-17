// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    mapping(address => uint256) private balances;
    mapping(address => string) private accountNames;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event NameChanged(address indexed account, string newName);

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    function setAccountName(string memory newName) public {
        accountNames[msg.sender] = newName;
        emit NameChanged(msg.sender, newName);
    }

    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }

    function getAccountName(address account) public view returns (string memory) {
        return accountNames[account];
    }
}
