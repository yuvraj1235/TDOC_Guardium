import React, { useState, useEffect } from "react";
import { loadVault, saveVault } from "../utils/storage";
import {
  encryptVaultWithKey,
  decryptVaultWithKey,
  deriveKeyFromSignature,
} from "../utils/CryptoService";
import { verifyVault, writeVaultHash } from "../utils/web3Service";
import { useWallet } from "../context/WalletProvider";



export default function Login({ onUnlock }) {
  const [vaultExists, setVaultExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const { signUnlockMessage, isConnected, connectWallet } = useWallet();
const ensureWalletConnected = async () => {
  if (!isConnected) {
    await connectWallet();
  }
};
  useEffect(() => {
    loadVault().then(v => {
      setVaultExists(!!v);
      setLoading(false);
    });
  }, []);

  const ensureWallet = async () => {
    if (!isConnected) {
      await connectWallet();
    }
  };

  // --------------------------
  // CREATE VAULT
  // --------------------------
const handleCreateVault = async () => {
  try {
    setBusy(true);

    console.log("1️⃣ Requesting signature");
    const signature = await signUnlockMessage();
    console.log("✅ Signature received:", signature);

    console.log("2️⃣ Deriving key");
    const key = deriveKeyFromSignature(signature);
    console.log("✅ Key derived:", key);

    const emptyVault = { accounts: [] };

    console.log("3️⃣ Encrypting vault");
    const encrypted = await encryptVaultWithKey(emptyVault, key);
    console.log("✅ Vault encrypted");

    console.log("4️⃣ Saving vault locally");
    await saveVault(encrypted);

    console.log("5️⃣ Writing hash to blockchain");
    await writeVaultHash(encrypted);

    console.log("🎉 DONE");
    onUnlock(emptyVault);

  } catch (err) {
    console.error(err);
    
  } finally {
    setBusy(false);
  }
};


  // --------------------------
  // UNLOCK VAULT
  // --------------------------
 const handleUnlock = async () => {
  try {
    setBusy(true);

    await chrome.storage.local.set({
      vault_unlock_pending: true,
    });

    const signature = await signUnlockMessage();
    const key = deriveKeyFromSignature(signature);

    const encryptedVault = await loadVault();
    const decrypted = await decryptVaultWithKey(encryptedVault, key);

    await chrome.storage.local.set({
      vault_unlocked: true,
      vault_unlock_pending: false,
    });

    onUnlock(decrypted);
  } catch (err) {
    await chrome.storage.local.remove("vault_unlock_pending");
    alert("Unlock failed");
  } finally {
    setBusy(false);
  }
};


  if (loading) return <p>Loading…</p>;

  return (
    <div className="card">
      <h3>{vaultExists ? "Unlock Vault" : "Create Vault"}</h3>

      <p className="hint">
        {vaultExists
          ? "Unlock the vault using your MetaMask wallet."
          : "Create a vault secured by your MetaMask identity. This will register it on the blockchain."}
      </p>

      <button
        className="primary"
        disabled={busy}
        onClick={vaultExists ? handleUnlock : handleCreateVault}
      >
        {busy
          ? "Waiting for MetaMask…"
          : vaultExists
          ? "🔓 Unlock with MetaMask"
          : "🔐 Create & Register with MetaMask"}
      </button>
    </div>
  );
}
