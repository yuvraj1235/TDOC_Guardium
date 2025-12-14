import React, { useState, useEffect } from "react";
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

  const handleCreateVault = async () => {
    if (!password) return alert("Master password required");

    const emptyVault = { accounts: [] };
    const encrypted = await encryptVault(emptyVault, password);

    await saveVault(encrypted);
    await writeVaultHash(encrypted);

    onUnlock(emptyVault, password);
  };

  const handleUnlock = async () => {
    const encryptedVault = await loadVault();
    if (!encryptedVault) return;

    const verified = await verifyVault(encryptedVault);
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
    <div className="card">
      <h3>{vaultExists ? "Unlock Vault" : "Create Vault"}</h3>

      <input
        type="password"
        placeholder="Master Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <p className="hint">
        {vaultExists
          ? "Blockchain will verify vault integrity before unlocking."
          : "Creating a vault registers its fingerprint on the blockchain."}
      </p>

      <button
        className="primary"
        onClick={vaultExists ? handleUnlock : handleCreateVault}
      >
        {vaultExists ? "Unlock Vault" : "Create & Register Vault"}
      </button>
    </div>
  );
}
