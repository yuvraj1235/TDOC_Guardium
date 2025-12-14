import React from "react";

export default function Vault({ vault }) {
  return (
    <div className="vault-list">
      <h4>Saved Passwords</h4>

      {vault.accounts.length === 0 && (
        <p className="hint">No passwords yet</p>
      )}

      {vault.accounts.map((a, i) => (
        <div key={i} className="vault-item">
          <strong>{a.site}</strong>
          <small>{a.username}</small>
        </div>
      ))}
    </div>
  );
}
