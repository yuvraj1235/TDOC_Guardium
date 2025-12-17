import React from "react";
import { useWallet } from "../context/WalletProvider";

export default function Header() {
  const { isConnected, account } = useWallet();

  return (
    <div style={styles.header}>
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <span style={styles.logoIcon}>🔐</span>
        <h1 style={styles.title}>Guardium</h1>
      </div>

      {/* Wallet Status */}
      <div style={styles.walletStatus}>
        <div style={styles.statusDot(isConnected)}></div>
        <span style={styles.statusText}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
}

const styles = {
  header: {
    width: '100%',
    padding: '16px 24px',
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    fontFamily: '"Ubuntu""Segoe UI", Roboto, sans-serif'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoIcon: {
    fontSize: '24px',
    lineHeight: '1'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#e2e8f0',
    letterSpacing: '-0.02em'
  },
  walletStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#1e293b',
    borderRadius: '20px',
    border: '1px solid #334155'
  },
  statusDot: (isConnected) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isConnected ? '#34d399' : '#f87171'
  }),
  statusText: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500'
  }
};