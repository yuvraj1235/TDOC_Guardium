const CryptoJS = require("../vendor/crypto-js.js");

const STORAGE_KEY = "guardium_vault_data";

export async function saveVault(items, masterKey) {
  const json = JSON.stringify(items);
  const encrypted = CryptoJS.AES.encrypt(json, masterKey).toString();
  await chrome.storage.local.set({ [STORAGE_KEY]: encrypted });
}

export async function loadVault(masterKey) {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (!result[STORAGE_KEY]) return [];

  try {
    const bytes = CryptoJS.AES.decrypt(result[STORAGE_KEY], masterKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : [];
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error("Invalid Master Key");
  }
}
