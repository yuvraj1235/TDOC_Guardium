import React, { useState } from "react";
import { encryptVault } from "../utils/CryptoService";
import { saveVault } from "../utils/storage";
import { writeVaultHash } from "../utils/web3Service";
import Toast from './Toast';

export default function AddPassword({ vault, masterPassword, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const save = async () => {
    if (!site.trim() || !password.trim()) {
      showToast('Website and Password are required.');
      return;
    }
    setSaving(true);
    try {
      const updated = {
        ...vault,
        accounts: [...vault.accounts, { site, username, password }]
      };
      const encrypted = await encryptVault(updated, masterPassword);
      await saveVault(encrypted);
      await writeVaultHash(encrypted);
      onUpdate(updated);
      showToast('Password saved successfully!');
      setTimeout(() => setOpen(false), 1000);
    } catch (err) {
      console.error(err);
      showToast('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      
      {!open && (
        <button 
          className="secondary" 
          onClick={() => setOpen(true)}
          style={styles.openButton}
        >
          ➕ Add Password
        </button>
      )}
      
      {open && (
        <div style={styles.container}>
          {/* Animated background effects */}
          <div style={styles.bgEffects}>
            <div style={styles.pinkBlur}></div>
            <div style={styles.blueBlur}></div>
          </div>

          {/* Main content */}
          <div style={styles.content}>
            {/* Header */}
            <div style={styles.header}>
              <button onClick={() => setOpen(false)} style={styles.backButton}>
                <svg style={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 style={styles.title}>ADD PASSWORD</h2>
              <div style={styles.headerSpacer}></div>
            </div>

            {/* Form */}
            <div style={styles.form}>
              {/* Website */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </label>
                <input
                  placeholder="e.g. github.com"
                  style={styles.input}
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>

              {/* Username */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Username
                </label>
                <input
                  placeholder="e.g. user@email.com"
                  style={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div style={styles.passwordWrapper}>
                  <input
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    style={styles.passwordInput}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={save}
              disabled={saving || !site.trim() || !password.trim()}
              style={{
                ...styles.button,
                opacity: (saving || !site.trim() || !password.trim()) ? 0.5 : 1,
                cursor: (saving || !site.trim() || !password.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={styles.buttonGlow}></div>
              <div style={styles.buttonContent}>
                {saving ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Save Password</span>
                )}
              </div>
            </button>

            {/* Info text */}
            <div style={styles.infoBox}>
              <svg style={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p style={styles.infoText}>
                Your password will be encrypted before being stored on the blockchain.
              </p>
            </div>
          </div>

          {/* Toast notification */}
          {toastMessage && <Toast message={toastMessage} />}
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
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  openButton: {
    position: 'relative',
    zIndex: 1
  },
  container: {
    width: '100%',
    minHeight: '400px',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    borderRadius: '8px'
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(236, 72, 153, 0.2)'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.3s'
  },
  backIcon: {
    width: '24px',
    height: '24px'
  },
  title: {
    flex: 1,
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    margin: 0
  },
  headerSpacer: {
    width: '32px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },
  labelIcon: {
    width: '14px',
    height: '14px',
    color: '#ec4899'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '6px',
    color: 'white',
    border: '1px solid #374151',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  passwordWrapper: {
    position: 'relative'
  },
  passwordInput: {
    width: '100%',
    padding: '10px 36px 10px 12px',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '6px',
    color: 'white',
    border: '1px solid #374151',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
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
  button: {
    width: '100%',
    position: 'relative',
    border: 'none',
    background: 'transparent',
    padding: 0,
    marginTop: 'auto',
    marginBottom: '12px',
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
  infoBox: {
    display: 'flex',
    gap: '8px',
    padding: '10px',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: '6px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    alignItems: 'flex-start'
  },
  infoIcon: {
    width: '16px',
    height: '16px',
    color: '#3b82f6',
    flexShrink: 0,
    marginTop: '2px'
  },
  infoText: {
    fontSize: '11px',
    color: '#9ca3af',
    lineHeight: '1.5',
    margin: 0
  }
};