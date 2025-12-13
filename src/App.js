import React, { useState } from "react";
import Login from "./components/Login";
import Vault from "./components/Vault";
import AddPassword from "./components/AddPassword";

export default function App() {
  const [view, setView] = useState("LOCKED");
  const [masterKey, setMasterKey] = useState(null);

  const unlock = (key) => {
    setMasterKey(key);
    setView("VAULT");
  };

  const lock = () => {
    setMasterKey(null);
    setView("LOCKED");
  };

  return (
    <main style={{ width: "350px", height: "500px", background: "#111", padding: "16px", color: "#fff" }}>
      {view === "LOCKED" && <Login onUnlock={unlock} />}

      {view === "VAULT" && masterKey && (
        <Vault masterKey={masterKey} onAdd={() => setView("ADD")} onLock={lock} />
      )}

      {view === "ADD" && masterKey && <AddPassword masterKey={masterKey} onBack={() => setView("VAULT")} />}
    </main>
  );
}
