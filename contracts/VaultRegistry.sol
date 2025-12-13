// contracts/VaultRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultRegistry {
    string private keyHash;

    function updateKeyHash(string memory _hmk) public {
        keyHash = _hmk;
    }

    function getKeyHash() public view returns (string memory) {
        return keyHash;
    }
}