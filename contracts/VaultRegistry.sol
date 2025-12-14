// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VaultRegistry
 * @author You
 * @notice Stores a cryptographic fingerprint of a user's encrypted password vault.
 * @dev No passwords, keys, or encrypted vault data are ever stored on-chain.
 */
contract VaultRegistry {

    /// @dev Maps a user wallet address to the hash of their encrypted vault
    mapping(address => bytes32) private vaultHashes;

    /// @notice Emitted whenever a user registers or updates their vault hash
    event VaultHashUpdated(
        address indexed user,
        bytes32 vaultHash,
        uint256 timestamp
    );

    /**
     * @notice Register or update the hash of the encrypted vault
     * @param _vaultHash keccak256 hash of the encrypted vault blob
     */
    function updateVaultHash(bytes32 _vaultHash) external {
        require(_vaultHash != bytes32(0), "Invalid vault hash");

        vaultHashes[msg.sender] = _vaultHash;

        emit VaultHashUpdated(
            msg.sender,
            _vaultHash,
            block.timestamp
        );
    }

    /**
     * @notice Get the stored vault hash for a specific user
     * @param user Wallet address of the vault owner
     * @return The stored vault hash
     */
    function getVaultHash(address user)
        external
        view
        returns (bytes32)
    {
        return vaultHashes[user];
    }

    /**
     * @notice Verify whether a locally computed vault hash matches the on-chain hash
     * @param user Wallet address of the vault owner
     * @param localHash Locally computed vault hash
     * @return True if the hashes match
     */
    function verifyVault(
        address user,
        bytes32 localHash
    ) external view returns (bool) {
        return vaultHashes[user] == localHash;
    }
}
