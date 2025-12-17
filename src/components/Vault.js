import React, { useEffect, useState } from "react";
import { getCurrentDomain } from "../utils/Tabs";
import Toast from './Toast';

export default function Vault({ vault }) {
  const [domain, setDomain] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error"); // Add toast type state

  const showToast = (msg, type = "info") => { // Accept type parameter, default to "info"
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    getCurrentDomain().then(setDomain);
  }, []);

  const matches = vault.accounts.filter(a =>
    domain && domain.includes(a.site)
  );

  const autofill = (username, password, site) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: "FILL_CREDENTIALS",
          username,
          password,
        },
        response => {
          if (!response?.filled) {
            showToast("No login fields detected on this page", "warning");
          } else {
            showToast(`Credentials filled for ${site}`, "success");
          }
        }
      );
    });
  };

  const handleCopyUsername = (username, site) => {
    navigator.clipboard.writeText(username);
    showToast(`Username copied!`, "success");
  };

  const handleCopyPassword = (password, site) => {
    navigator.clipboard.writeText(password);
    showToast(`Password copied!`, "success");
  };

  const filteredMatches = matches.filter(item => 
    item.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <div style={styles.bgEffects}>
        <div style={styles.colorBlur}></div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Your Vault</h1>
        <p style={styles.status}>
          {matches.length === 0 
            ? "No passwords for this site yet" 
            : `${matches.length} password${matches.length !== 1 ? 's' : ''} for ${domain || "this site"}`
          }
        </p>

        {matches.length > 0 && (
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="search passwords..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={styles.clearButton}>
                ×
              </button>
            )}
          </div>
        )}

        <div style={styles.vaultList}>
          {filteredMatches.length === 0 && searchQuery && (
            <p style={styles.emptyMessage}>No matches found</p>
          )}
          
          {filteredMatches.map((account, index) => (
            <div key={index} style={styles.vaultItem}>
              <div style={styles.itemTop}>
                <div style={styles.siteInfo}>
                  <p style={styles.siteName}>{account.site}</p>
                  {account.username && (
                    <p style={styles.username}>{account.username}</p>
                  )}
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button
                  onClick={() => handleCopyUsername(account.username, account.site)}
                  style={styles.actionButton}
                  title="Copy Username"
                >
                  <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span style={styles.buttonLabel}>username</span>
                </button>

                <button
                  onClick={() => autofill(account.username, account.password, account.site)}
                  style={styles.primaryButton}
                  title="Autofill"
                >
                  <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span style={styles.buttonLabel}>autofill</span>
                </button>

                <button
                  onClick={() => handleCopyPassword(account.password, account.site)}
                  style={styles.actionButton}
                  title="Copy Password"
                >
                  <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span style={styles.buttonLabel}>password</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.25; }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: '"Ubuntu","Segoe UI", Roboto, sans-serif'
  },
  bgEffects: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none'
  },
  colorBlur: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '300px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.15,
    animation: 'pulse 4s infinite ease-in-out'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    maxHeight: '100%',
    overflow: 'hidden'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    color: '#e2e8f0',
    letterSpacing: '-0.02em'
  },
  status: {
    color: '#64748b',
    fontSize: '15px',
    margin: '-8px 0 8px 0',
    textAlign: 'center'
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '280px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 36px 12px 16px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    color: '#e2e8f0',
    border: '1px solid #334155',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1
  },
  vaultList: {
    width: '100%',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    maxHeight: '400px',
    paddingRight: '4px'
  },
  emptyMessage: {
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
    margin: '20px 0'
  },
  vaultItem: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    animation: 'slideUp 0.3s ease-out',
    transition: 'all 0.2s ease'
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  siteInfo: {
    flex: 1,
    minWidth: 0
  },
  siteName: {
    color: '#e2e8f0',
    fontSize: '15px',
    fontWeight: '600',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  username: {
    color: '#64748b',
    fontSize: '13px',
    margin: '4px 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  actionButtons: {
    display: 'flex',
    gap: '6px',
    width: '100%'
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 8px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid #334155',
    borderRadius: '10px',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  primaryButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 8px',
    background: '#10b981',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
  },
  actionIcon: {
    width: '14px',
    height: '14px',
    flexShrink: 0
  },
  buttonLabel: {
    whiteSpace: 'nowrap'
  }
};
