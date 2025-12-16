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

  useEffect(() => {
    loadVault().then(v => {
      setVaultExists(!!v);
      setLoading(false);
    });
  }, []);

  // --------------------------
  // CREATE VAULT
  // --------------------------
  const handleCreateVault = async () => {
    try {
      setBusy(true);

      const signature = await signUnlockMessage();
      const key = deriveKeyFromSignature(signature);

      const emptyVault = { accounts: [] };
      const encrypted = await encryptVaultWithKey(emptyVault, key);

      await saveVault(encrypted);
      await writeVaultHash(encrypted);

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

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.bgEffects}>
          <div style={styles.pinkBlur}></div>
          <div style={styles.blueBlur}></div>
        </div>
        <div style={styles.content}>
          <div style={styles.spinner}></div>
          <p style={styles.status}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      {/* Background */}
      <div style={styles.bgEffects}>
        <div style={styles.pinkBlur}></div>
        <div style={styles.blueBlur}></div>
      </div>

      {/* Main */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          {vaultExists ? "UNLOCK VAULT" : "CREATE VAULT"}
        </h1>

        <p style={styles.status}>
          {vaultExists
            ? "Unlock the vault using your MetaMask wallet"
            : "Create a vault secured by your MetaMask identity"}
        </p>

        <button
          onClick={vaultExists ? handleUnlock : handleCreateVault}
          disabled={busy}
          style={{
            ...styles.button,
            opacity: busy ? 0.5 : 1,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          <div style={styles.buttonGlow}></div>
          <div style={styles.buttonContent}>
            {busy ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <span>Waiting for MetaMask…</span>
              </div>
            ) : vaultExists ? (
              "🔓 Unlock with MetaMask"
            ) : (
              "🔐 Create & Register with MetaMask"
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const keyframes = `
@keyframes pulse {
  0%,100%{opacity:0.6}
  50%{opacity:1}
}
@keyframes spin {
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}
`;

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: 0,
  },
  bgEffects: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  pinkBlur: {
    position: "absolute",
    top: "10%",
    left: "20%",
    width: 150,
    height: 150,
    background: "rgba(219,39,119,0.3)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s infinite",
  },
  blueBlur: {
    position: "absolute",
    bottom: "10%",
    right: "20%",
    width: 150,
    height: 150,
    background: "rgba(59,130,246,0.3)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s infinite 1.5s",
  },
  content: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: "0.1em",
    background: "linear-gradient(to right,#ec4899,#a855f7,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  status: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  button: {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: 0,
  },
  buttonGlow: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right,#db2777,#2563eb)",
    borderRadius: 6,
    filter: "blur(6px)",
    opacity: 0.6,
  },
  buttonContent: {
    position: "relative",
    background: "linear-gradient(to right,#db2777,#2563eb)",
    padding: 12,
    borderRadius: 6,
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
