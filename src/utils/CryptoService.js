import CryptoJS from "../vendor/crypto-js.js";
import { ethers } from "ethers";

/**
 * Derive a vault encryption key from MetaMask signature
 */
export function deriveKeyFromSignature(signature) {
  if (!signature || typeof signature !== "string") {
    throw new Error("INVALID_SIGNATURE");
  }

  // Signature is already hex → hash it to get fixed-length key
  return ethers.utils.keccak256(signature);
}

/**
 * Encrypt vault using derived key
 */
export async function encryptVaultWithKey(vault, key) {
  const json = JSON.stringify(vault);
  const encrypted = CryptoJS.AES.encrypt(json, key).toString();

  return {
    ciphertext: encrypted,
    version: 1,
  };
}

/**
 * Decrypt vault using derived key
 */
export async function decryptVaultWithKey(encryptedVault, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedVault.ciphertext, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) throw new Error("DECRYPT_FAILED");

    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Vault decryption failed:", err);
    throw new Error("INVALID_WALLET_OR_SIGNATURE");
  }
}
