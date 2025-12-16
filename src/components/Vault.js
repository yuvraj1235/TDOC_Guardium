import React, { useEffect, useState } from "react";
import { getCurrentDomain } from "../utils/Tabs";

export default function Vault({ vault }) {
  const [domain, setDomain] = useState(null);

  useEffect(() => {
    getCurrentDomain().then(setDomain);
  }, []);

  const matches = vault.accounts.filter(a =>
    domain && domain.includes(a.site)
  );

  const autofill = (username, password) => {
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
            alert("No login fields detected on this page");
          }
        }
      );
    });
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      {/* Background effects */}
      <div style={styles.bgEffects}>
        <div style={styles.pinkBlur}></div>
        <div style={styles.blueBlur}></div>
      </div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleWrapper}>
            <svg style={styles.vaultIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 style={styles.title}>
              Passwords for {domain || "this site"}
            </h2>
          </div>
        </div>

        {/* Empty state */}
        {matches.length === 0 && (
          <p style={styles.emptyText}>No passwords for this site</p>
        )}

        {/* Vault list */}
        <div style={styles.vaultList}>
          {matches.map((a, i) => (
            <div key={i} style={styles.vaultItem}>
              <div style={styles.itemContent}>
                {/* Left */}
                <div style={styles.itemLeft}>
                  <div style={styles.itemIcon}>
                    🌐
                  </div>
                  <div style={styles.itemInfo}>
                    <p style={styles.itemSite}>{a.site}</p>
                    <p style={styles.itemUsername}>{a.username}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => navigator.clipboard.writeText(a.username)}
                  >
                    👤
                  </button>

                  <button
                    style={{ ...styles.actionBtn, ...styles.autofill }}
                    onClick={() => autofill(a.username, a.password)}
                  >
                    ⚡
                  </button>

                  <button
                    style={styles.actionBtn}
                    onClick={() => navigator.clipboard.writeText(a.password)}
                  >
                    🔒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= UI STYLES ONLY ================= */

const keyframes = `
@keyframes pulse {
  0%,100%{opacity:.6}
  50%{opacity:1}
}
`;

const styles = {
  container: {
    width: "100%",
    minHeight: "400px",
    backgroundColor: "#000",
    padding: 16,
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    boxSizing: "border-box",
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
    background: "rgba(219,39,119,.3)",
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
    background: "rgba(59,130,246,.3)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s infinite 1.5s",
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    borderBottom: "1px solid rgba(236,72,153,.2)",
    paddingBottom: 10,
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  vaultIcon: {
    width: 18,
    height: 18,
    color: "#ec4899",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    background: "linear-gradient(to right,#ec4899,#a855f7,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  emptyText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  vaultList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  vaultItem: {
    borderRadius: 6,
  },
  itemContent: {
    background: "rgba(31,41,55,.6)",
    border: "1px solid rgba(75,85,99,.5)",
    borderRadius: 6,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  itemLeft: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: "linear-gradient(135deg,rgba(236,72,153,.2),rgba(59,130,246,.2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemInfo: {
    minWidth: 0,
  },
  itemSite: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemUsername: {
    fontSize: 10,
    color: "#9ca3af",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: 4,
  },
  actionBtn: {
    background: "none",
    border: "1px solid rgba(59,130,246,.5)",
    color: "#3b82f6",
    padding: 6,
    borderRadius: 6,
    cursor: "pointer",
  },
  autofill: {
    borderColor: "rgba(168,85,247,.5)",
    color: "#a855f7",
  },
};
