import React, { useState } from "react";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Login from "./components/Login";
import Vault from "./components/Vault";
import AddPassword from "./components/AddPassword";
import "./App.css";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [vault, setVault] = useState(null);
  const [masterPassword, setMasterPassword] = useState(null);

  // Show intro for all users every time
  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

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