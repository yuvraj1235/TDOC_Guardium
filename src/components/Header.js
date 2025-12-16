import React from "react";
import { useWallet } from "../context/WalletProvider";

export default function Header() {
  const { isConnected, account } = useWallet();

  return (
    <div style={styles.header}>
      <style>{keyframes}</style>

      {/* Logo Section */}
      <div style={styles.logoSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoGlow}></div>
          <div style={styles.hexContainer}>
            <div style={styles.centralCore}></div>
            <svg style={styles.hexSvg} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <polygon
                points="50,5 90,30 90,70 50,95 10,70 10,30"
                fill="none"
                stroke="url(#hexGrad)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <h3 style={styles.title}>GUARDIAN</h3>
      </div>

      {/* Wallet Status */}
      <div style={styles.walletStatus}>
        <div style={styles.statusDot(isConnected)}></div>
        <small style={styles.statusText}>
          Wallet: {isConnected ? "Connected" : "Not Connected"}
        </small>
      </div>
    </div>
  );
}

const keyframes = `
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
`;

const styles = {
  header: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.95)",
    borderBottom: "1px solid rgba(55,65,81,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    backdropFilter: "blur(10px)"
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logoContainer: {
    position: "relative"
  },
  logoGlow: {
    position: "absolute",
    inset: "-8px",
    background: "linear-gradient(to right, #ec4899, #3b82f6)",
    borderRadius: "50%",
    filter: "blur(12px)",
    opacity: 0.4,
    animation: "glow 2s infinite"
  },
  hexContainer: {
    position: "relative",
    width: "40px",
    height: "40px"
  },
  centralCore: {
    position: "absolute",
    inset: 0,
    margin: "auto",
    width: "14px",
    height: "14px",
    background: "linear-gradient(to right, #ec4899, #a855f7)",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
    boxShadow: "0 0 12px rgba(236,72,153,0.6)"
  },
  hexSvg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%"
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #ec4899, #a855f7, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.1em"
  },
  walletStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "rgba(31,41,55,0.8)",
    borderRadius: "20px",
    border: "1px solid rgba(55,65,81,0.8)"
  },
  statusDot: (isConnected) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: isConnected ? "#10b981" : "#ef4444",
    boxShadow: isConnected
      ? "0 0 8px rgba(16,185,129,0.6)"
      : "0 0 8px rgba(239,68,68,0.6)",
    animation: isConnected ? "pulse 2s infinite" : "none"
  }),
  statusText: {
    fontSize: "12px",
    color: "#9ca3af"
  }
};
