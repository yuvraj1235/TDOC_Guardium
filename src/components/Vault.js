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
    <div className="vault-list">
      <h4>
        Passwords for {domain || "this site"}
      </h4>

      {matches.length === 0 && (
        <p className="hint">No passwords for this site</p>
      )}

      {matches.map((a, i) => (
        <div key={i} className="vault-item">
          <strong>{a.site}</strong>
          <small>{a.username}</small>

          <div>
            <button
              onClick={() => navigator.clipboard.writeText(a.username)}
            >
              Copy Username
            </button>
            <button onClick={() => autofill(a.username, a.password)}>
              Autofill
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(a.password)}
            >
              Copy Password
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
