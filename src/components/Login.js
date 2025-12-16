import React, { useState, useEffect } from "react";
import { loadVault, saveVault } from "../utils/storage";
import { encryptVault, decryptVault } from "../utils/CryptoService";
import { verifyVault, writeVaultHash } from "../utils/web3Service";
import Toast from './Toast';

export default function Login({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [vaultExists, setVaultExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function init() {
      try {
        const vault = await loadVault();
        setVaultExists(!!vault);
        setStatus(vault ? "Unlock your Vault" : "Create Master Password");
      } catch (err) {
        console.error(err);
        setStatus("⚠ Error loading vault");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCreateVault = async () => {
    if (!password || password.length < 8) {
      showToast("Master password must be at least 8 characters");
      return;
    }
    
    setProcessing(true);
    setStatus("Creating vault...");
    
    try {
      const emptyVault = { accounts: [] };
      const encrypted = await encryptVault(emptyVault, password);
      await saveVault(encrypted);
      
      setStatus("Registering on blockchain...");
      await writeVaultHash(encrypted);
      
      setStatus("Vault created ✓");
      setTimeout(() => onUnlock(emptyVault, password), 1000);
    } catch (err) {
      console.error(err);
      showToast("Failed to create vault: " + err.message);
      setStatus("Create Master Password");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnlock = async () => {
    if (!password || password.length < 8) {
      showToast("Master password must be at least 8 characters");
      return;
    }
    
    setProcessing(true);
    setStatus("Verifying vault integrity...");
    
    try {
      const encryptedVault = await loadVault();
      if (!encryptedVault) {
        showToast("No vault found");
        setProcessing(false);
        return;
      }

      const verified = await verifyVault(encryptedVault);
      if (!verified) {
        showToast("Vault verification failed - blockchain integrity check failed");
        setProcessing(false);
        setStatus("Unlock your Vault");
        return;
      }

      setStatus("Decrypting vault...");
      const decrypted = await decryptVault(encryptedVault, password);
      
      setStatus("Unlocking...");
      setTimeout(() => onUnlock(decrypted, password), 800);
    } catch (err) {
      console.error(err);
      showToast("Wrong master password");
      setPassword("");
      setStatus("Unlock your Vault");
    } finally {
      setProcessing(false);
    }
  };

  const handleAuth = () => {
    if (vaultExists) {
      handleUnlock();
    } else {
      handleCreateVault();
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
      
      {/* Animated background effects */}
      <div style={styles.bgEffects}>
        <div style={styles.pinkBlur}></div>
        <div style={styles.blueBlur}></div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {/* Title */}
        <h1 style={styles.title}>CREATE VAULT</h1>
        
        {/* Status */}
        <p style={styles.status}>{status}</p>
        
        {/* Password label */}
        <label style={styles.label}>Master Password</label>
        
        {/* Password input */}
        <div style={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter at least 8 characters..."
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !processing && handleAuth()}
            disabled={processing}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Password strength */}
        <div style={styles.strengthBar}>
          <div style={{
            ...styles.strengthFill,
            background: password.length >= 8 ? 'linear-gradient(to right, #ec4899, #a855f7)' : '#374151'
          }}></div>
          <span style={styles.strengthText}>{password.length}/8 min</span>
        </div>

        {/* Action button */}
        <button
          onClick={handleAuth}
          disabled={processing || password.length < 8}
          style={{
            ...styles.button,
            opacity: (processing || password.length < 8) ? 0.5 : 1,
            cursor: (processing || password.length < 8) ? 'not-allowed' : 'pointer'
          }}
        >
          <div style={styles.buttonGlow}></div>
          <div style={styles.buttonContent}>
            {processing ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <span>Processing...</span>
              </div>
            ) : vaultExists ? (
              "Unlock Vault"
            ) : (
              "Create & Register Vault"
            )}
          </div>
        </button>

        {/* Toggle mode */}
        {!processing && (
          <button
            onClick={() => {
              setVaultExists((prev) => !prev);
              setStatus(!vaultExists ? "Unlock your Vault" : "Create Master Password");
              setPassword("");
            }}
            style={styles.toggleButton}
          >
            {vaultExists ? (
              <span style={styles.toggleText}>New user? <span style={{color: '#3b82f6'}}>Create New Vault</span></span>
            ) : (
              <span style={styles.toggleText}>Already have a vault? <span style={{color: '#ec4899'}}>Unlock instead</span></span>
            )}
          </button>
        )}
      </div>

      {/* Toast notification */}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  bgEffects: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  pinkBlur: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: '150px',
    height: '150px',
    backgroundColor: 'rgba(219, 39, 119, 0.3)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 3s infinite'
  },
  blueBlur: {
    position: 'absolute',
    bottom: '10%',
    right: '20%',
    width: '150px',
    height: '150px',
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'pulse 3s infinite 1.5s'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '0.1em'
  },
  status: {
    color: '#9ca3af',
    fontSize: '12px',
    margin: '0 0 8px 0',
    textAlign: 'center'
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    width: '100%'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '10px 36px 10px 12px',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '6px',
    color: 'white',
    border: '1px solid #374151',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  eyeButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px'
  },
  strengthBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '10px',
    color: '#6b7280',
    width: '100%',
    marginBottom: '4px'
  },
  strengthFill: {
    height: '3px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background 0.3s'
  },
  strengthText: {
    whiteSpace: 'nowrap'
  },
  button: {
    width: '100%',
    position: 'relative',
    border: 'none',
    background: 'transparent',
    padding: 0,
    transition: 'all 0.3s'
  },
  buttonGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, #db2777, #2563eb)',
    borderRadius: '6px',
    filter: 'blur(6px)',
    opacity: 0.6
  },
  buttonContent: {
    position: 'relative',
    background: 'linear-gradient(to right, #db2777, #2563eb)',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    color: 'white',
    fontSize: '14px',
    textTransform: 'uppercase'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  toggleButton: {
    fontSize: '11px',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    marginTop: '4px'
  },
  toggleText: {
    display: 'block'
  }
};