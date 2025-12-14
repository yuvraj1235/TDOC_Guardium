import React from "react";

export default function Vault({ vault }) {
  return (
    <div style={{ maxHeight: "260px", overflowY: "auto" }}>
      <h3>Saved Passwords</h3>

      {vault.accounts.length === 0 && (
        <p>No passwords yet</p>
      )}

      {vault.accounts.map((a, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <strong>{a.site}</strong><br />
          <small>{a.username}</small>
        </div>
      ))}
    </div>
  );
}
