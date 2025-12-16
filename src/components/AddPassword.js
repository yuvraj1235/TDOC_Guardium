import React, { useState } from "react";
import { encryptVault } from "../utils/CryptoService";
import { saveVault } from "../utils/storage";
import { writeVaultHash } from "../utils/web3Service";

export default function AddPassword({ vault, masterPassword, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const save = async () => {
    const updated = {
      ...vault,
      accounts: [...vault.accounts, { site, username, password }]
    };

    const encrypted = await encryptVault(updated, masterPassword);
    await saveVault(encrypted);
    await writeVaultHash(encrypted);

    onUpdate(updated);
    setOpen(false);
  };

  return (
    <>
      <style>{keyframes}</style>

      {!open && (
        <button style={styles.openButton} onClick={() => setOpen(true)}>
          ➕ Add Password
        </button>
      )}

      {open && (
        <div style={styles.container}>
          {/* Background effects */}
          <div style={styles.bgEffects}>
            <div style={styles.pinkBlur}></div>
            <div style={styles.blueBlur}></div>
          </div>

          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <button onClick={() => setOpen(false)} style={styles.backButton}>
                ←
              </button>
              <h2 style={styles.title}>ADD PASSWORD</h2>
              <div style={{ width: 24 }} />
            </div>

            {/* Form */}
            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Website</label>
                <input
                  style={styles.input}
                  placeholder="e.g. github.com"
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  style={styles.input}
                  placeholder="e.g. email@example.com"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    style={styles.passwordInput}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button onClick={save} style={styles.button}>
              <div style={styles.buttonGlow}></div>
              <div style={styles.buttonContent}>Save Password</div>
            </button>

            {/* Cancel */}
            <button
              onClick={() => setOpen(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const keyframes = `
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
`;

const styles = {
  openButton: {
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    borderRadius: "6px",
    border: "1px solid #374151",
    cursor: "pointer"
  },
  container: {
    width: "100%",
    minHeight: "400px",
    backgroundColor: "#000",
    borderRadius: "8px",
    position: "relative",
    overflow: "hidden"
  },
  bgEffects: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none"
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
    animation: "pulse 3s infinite"
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
    animation: "pulse 3s infinite 1.5s"
  },
  content: {
    position: "relative",
    zIndex: 2,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    fontSize: 18,
    cursor: "pointer"
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    background: "linear-gradient(to right, #ec4899, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  label: {
    fontSize: 11,
    color: "#9ca3af",
    textTransform: "uppercase"
  },
  input: {
    padding: "10px 12px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 6,
    color: "white"
  },
  passwordWrapper: {
    position: "relative"
  },
  passwordInput: {
    width: "100%",
    padding: "10px 36px 10px 12px",
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: 6,
    color: "white"
  },
  eyeButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer"
  },
  button: {
    position: "relative",
    marginTop: "auto",
    border: "none",
    background: "transparent",
    padding: 0
  },
  buttonGlow: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, #db2777, #2563eb)",
    borderRadius: 6,
    filter: "blur(6px)",
    opacity: 0.6
  },
  buttonContent: {
    position: "relative",
    background: "linear-gradient(to right, #db2777, #2563eb)",
    padding: 12,
    borderRadius: 6,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  cancelButton: {
    marginTop: 10,
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer"
  }
};
