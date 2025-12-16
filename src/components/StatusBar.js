import React from "react";

export default function StatusBar({ text, type }) {
  return (
    <div style={getStatusStyle(type)}>
      <div style={styles.glow(type)}></div>
      <div style={styles.content}>
        {getIcon(type)}
        <span>{text}</span>
      </div>
    </div>
  );
}

/* ---------- UI helpers (NO logic change) ---------- */

function getIcon(type) {
  const icons = {
    success: "✓",
    error: "⚠",
    warning: "⚠",
    info: "ℹ",
  };

  if (!icons[type]) return null;
  return <span style={styles.icon}>{icons[type]}</span>;
}

function getStatusStyle(type) {
  const base = {
    position: "relative",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
    boxSizing: "border-box",
    overflow: "hidden",
  };

  const variants = {
    success: {
      backgroundColor: "rgba(16,185,129,0.1)",
      borderColor: "rgba(16,185,129,0.3)",
      color: "#10b981",
    },
    error: {
      backgroundColor: "rgba(239,68,68,0.1)",
      borderColor: "rgba(239,68,68,0.3)",
      color: "#ef4444",
    },
    warning: {
      backgroundColor: "rgba(245,158,11,0.1)",
      borderColor: "rgba(245,158,11,0.3)",
      color: "#f59e0b",
    },
    info: {
      backgroundColor: "rgba(59,130,246,0.1)",
      borderColor: "rgba(59,130,246,0.3)",
      color: "#3b82f6",
    },
  };

  return {
    ...base,
    ...(variants[type] || {
      backgroundColor: "rgba(107,114,128,0.1)",
      borderColor: "rgba(107,114,128,0.3)",
      color: "#9ca3af",
    }),
  };
}

const styles = {
  glow: (type) => {
    const colors = {
      success: "rgba(16,185,129,0.2)",
      error: "rgba(239,68,68,0.2)",
      warning: "rgba(245,158,11,0.2)",
      info: "rgba(59,130,246,0.2)",
    };

    return {
      position: "absolute",
      inset: 0,
      background: colors[type] || "rgba(107,114,128,0.1)",
      filter: "blur(8px)",
      opacity: 0.5,
      pointerEvents: "none",
    };
  },
  content: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 1,
  },
  icon: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};
