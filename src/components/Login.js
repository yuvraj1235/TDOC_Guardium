import React from "react";

import { useState, useEffect } from "react";
import { loadVault, saveVault } from "../utils/storage";
import { encryptVault, decryptVault } from "../utils/CryptoService";
import { verifyVault, writeVaultHash } from "../utils/web3Service";

export default function Login({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [vaultExists, setVaultExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVault().then(v => {
      setVaultExists(!!v);
      setLoading(false);
    });
  }, []);

  // --------------------------
  // FIRST TIME SETUP
  // --------------------------
  const handleCreateVault = async () => {
    if (!password) return alert("Master password required");

    const emptyVault = { accounts: [] };

    const encrypted = await encryptVault(emptyVault, password);
    await saveVault(encrypted);

    try {
      await writeVaultHash(encrypted);
    } catch (e) {
      alert("Blockchain connection required for setup");
      return;
    }

    onUnlock(emptyVault, password);
  };

  // --------------------------
  // NORMAL LOGIN
  // --------------------------
  const handleUnlock = async () => {
    const encryptedVault = await loadVault();
    if (!encryptedVault) return;

    // Blockchain verification (MANDATORY)
    let verified = false;
    try {
      verified = await verifyVault(encryptedVault);
    } catch {
      alert("MetaMask / blockchain unavailable");
      return;
    }

    if (!verified) {
      alert("Vault verification failed");
      return;
    }

    try {
      const decrypted = await decryptVault(encryptedVault, password);
      onUnlock(decrypted, password);
    } catch {
      alert("Wrong master password");
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>{vaultExists ? "Unlock Vault" : "Create Vault"}</h2>

      <input
        type="password"
        placeholder="Master Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={vaultExists ? handleUnlock : handleCreateVault}>
        {vaultExists ? "Unlock" : "Create Vault"}
      </button>
    </div>
  );
}
