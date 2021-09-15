// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract Hello {
    
    string public message;

    constructor(string memory initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    receive() external payable {}
}