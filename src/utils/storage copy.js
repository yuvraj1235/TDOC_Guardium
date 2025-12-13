import * as CryptoJS from 'crypto-js';

const STORAGE_KEY = 'user_vault';

function isChromeExtension() {
  // Checks if 'chrome' object exists and has the 'runtime' property
  return typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined';
}

/**
 * Saves the password data, encrypting it first.
 * @param data The vault data to save.
 * @param masterKey The master password used as the encryption key.
 */
export async function saveVault(data, masterKey) {
  if (!isChromeExtension()) {
    console.warn("⚠️ Not running in Chrome Extension context. Save aborted.");
    return;
  }
  
  const dataString = JSON.stringify(data);
  const encryptedObject = CryptoJS.AES.encrypt(dataString, masterKey);
  
  // Convert the encrypted object to a string format (CRITICAL for saving)
  const encryptedString = encryptedObject.toString(); 
  
  await chrome.storage.local.set({ [STORAGE_KEY]: encryptedString });
  console.log("Vault saved securely.");
}


/**
 * Retrieves and decrypts the password data from storage.
 * @param masterKey The master password used as the decryption key.
 */
export async function loadVault(masterKey) {
  if (!isChromeExtension()) {
    console.warn("⚠️ Not running in Chrome Extension context. Returning empty vault.");
    return []; 
  }
  
  const result = await chrome.storage.local.get(STORAGE_KEY);
  
  // 1. Check if the stored value exists
  if (result[STORAGE_KEY]) {
    // 2. Assign the stored value, ensuring it is treated as a string
    const encryptedString = result[STORAGE_KEY];

    if (!encryptedString) {
        return []; // Handle empty string case
    }
    
    // 3. Decrypt the string
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, masterKey);
    
    // 4. Convert the decrypted bytes into a UTF8 string
    const dataString = decryptedBytes.toString(CryptoJS.enc.Utf8); 
    
    // 5. Convert the JSON string back into a JavaScript object
    try {
        if (!dataString) {
            console.error("Decryption resulted in empty data string (wrong key or corrupted data).");
            return [];
        }
        return JSON.parse(dataString);
    } catch (e) {
        console.error("JSON parsing failed after decryption:", e);
        return [];
    }
  }
  
  return [];
}
