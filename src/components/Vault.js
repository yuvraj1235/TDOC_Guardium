import React, { useEffect, useState } from "react";
import { getCurrentDomain } from "../utils/Tabs";
import Toast from './Toast';

export default function Vault({ vault }) {
  const [domain, setDomain] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
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
            showToast("No login fields detected on this page");
          } else {
            showToast(`Credentials filled for ${site}`);
          }
        }
      );
    });
  };

  const handleCopyUsername = (username, site) => {
    navigator.clipboard.writeText(username);
    showToast(`Username for ${site} copied!`);
  };

  const handleCopyPassword = (password, site) => {
    navigator.clipboard.writeText(password);
    showToast(`Password for ${site} copied!`);
  };

  const filteredMatches = matches.filter(item => 
    item.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleWrapper}>
            <svg style={styles.vaultIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 style={styles.title}>Passwords for {domain || "this site"}</h2>
          </div>
        </div>

        {/* Search bar */}
        {matches.length > 0 && (
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search passwords..."
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

        {/* Vault items */}
        <div style={styles.vaultList}>
          
          {filteredMatches.map((account, index) => (
            <div key={index} style={styles.vaultItem}>
              <div style={styles.itemGlow}></div>
              <div style={styles.itemContent}>
                {/* Left side - Site info */}
                <div style={styles.itemLeft}>
                  <div style={styles.itemIcon}>
                    <svg style={styles.itemIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div style={styles.itemInfo}>
                    <p style={styles.itemSite}>{account.site}</p>
                    {account.username && (
                      <p style={styles.itemUsername}>{account.username}</p>
                    )}
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div style={styles.actionButtons}>
                  {/* Copy Username */}
                  <button
                    onClick={() => handleCopyUsername(account.username, account.site)}
                    style={styles.actionButton}
                    title="Copy Username"
                  >
                    <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {/* Autofill */}
                  <button
                    onClick={() => autofill(account.username, account.password, account.site)}
                    style={{...styles.actionButton, ...styles.autofillButton}}
                    title="Autofill"
                  >
                    <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>

                  {/* Copy Password */}
                  <button
                    onClick={() => handleCopyPassword(account.password, account.site)}
                    style={styles.actionButton}
                    title="Copy Password"
                  >
                    <svg style={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
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
    minHeight: '400px',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(236, 72, 153, 0.2)'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  vaultIcon: {
    width: '18px',
    height: '18px',
    color: '#ec4899'
  },
  title: {
    fontSize: '14px',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0
  },
  searchWrapper: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '14px',
    height: '14px',
    color: '#6b7280',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '8px 32px 8px 32px',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '6px',
    color: 'white',
    border: '1px solid #374151',
    outline: 'none',
    fontSize: '12px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  clearButton: {
    position: 'absolute',
    right: '6px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  vaultList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '2px'
  },

  vaultItem: {
    position: 'relative',
    marginBottom: '2px'
  },
  itemGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))',
    borderRadius: '6px',
    filter: 'blur(6px)',
    opacity: 0
  },
  itemContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: '6px',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    transition: 'all 0.3s',
    gap: '8px'
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0
  },
  itemIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  itemIconSvg: {
    width: '14px',
    height: '14px',
    color: '#ec4899'
  },
  itemInfo: {
    flex: 1,
    minWidth: 0
  },
  itemSite: {
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  itemUsername: {
    color: '#9ca3af',
    fontSize: '10px',
    margin: '2px 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  actionButtons: {
    display: 'flex',
    gap: '4px',
    flexShrink: 0
  },
  actionButton: {
    background: 'none',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    color: '#3b82f6',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  autofillButton: {
    borderColor: 'rgba(168, 85, 247, 0.5)',
    color: '#a855f7'
  },
  actionIcon: {
    width: '14px',
    height: '14px'
  }
};
