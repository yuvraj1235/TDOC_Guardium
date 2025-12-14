
import React from "react";
import { useState } from "react";
import Login from "./components/Login";
import Vault from "./components/Vault";
import AddPassword from "./components/AddPassword";

export default function App() {
  const [vault, setVault] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null);

  if (!vault) {
    return (
      <Login
        onUnlock={(v, m) => {
          setVault(v);
          setMasterPassword(m);
        }}
      />
    );
  }

  return (
    <>
      <Vault vault={vault} />
      <AddPassword
        vault={vault}
        masterPassword={masterPassword}
        onUpdate={setVault}
      />
    </>
  );
}
