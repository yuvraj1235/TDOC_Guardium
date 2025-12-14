import React, { useState } from "react";
import { encryptVault } from "../utils/CryptoService";
import { saveVault } from "../utils/storage";
import { writeVaultHash } from "../utils/web3Service";

export default function AddPassword({ vault, masterPassword, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    if (!site || !password) {
      alert("Site and password are required");
      return;
    }

    const updatedVault = {
      ...vault,
      accounts: [...vault.accounts, { site, username, password }]
    };

    const encrypted = await encryptVault(updatedVault, masterPassword);
    await saveVault(encrypted);
    await writeVaultHash(encrypted);

    onUpdate(updatedVault);
    setOpen(false);
    setSite("");
    setUsername("");
    setPassword("");
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}>
          ➕ Add Password
        </button>
      )}

      {open && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}>
          <input
            placeholder="Website"
            value={site}
            onChange={e => setSite(e.target.value)}
          />
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div style={{ marginTop: "8px" }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
