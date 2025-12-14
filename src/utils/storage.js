// utils/storage.js

const STORAGE_KEY = "guardium_vault_data";

export async function saveVault(encryptedVault) {
  await chrome.storage.local.set({
    [STORAGE_KEY]: encryptedVault,
  });
}

export async function loadVault() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}


export function clearVault() {
  return new Promise(resolve => {
    chrome.storage.local.remove("vault", resolve);
  });
}
