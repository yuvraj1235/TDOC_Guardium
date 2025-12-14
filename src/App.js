import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Vault from "./components/Vault";
import AddPassword from "./components/AddPassword";
import "./App.css";

export default function App() {
  const [vault, setVault] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null);
  useEffect(() => {
    chrome.storage.local.get([
      "vault_unlocked",
      "vault_unlock_pending",
    ]).then((res) => {
      if (res.vault_unlocked) {
        // directly load vault UI
        setUnlocked(true);
      }
    });
  }, []);

  return (
    <>
      <Header />

      <div className="content">
        {!vault ? (
          <Login
            onUnlock={(v, m) => {
              setVault(v);
              setMasterPassword(m);
            }}
          />
        ) : (
          <>
            <Vault vault={vault} />
            <AddPassword
              vault={vault}
              masterPassword={masterPassword}
              onUpdate={setVault}
            />
          </>
        )}
      </div>
    </>
  );
}
