import React, { useState } from "react";
import { encryptVault } from "../utils/CryptoService";
import { saveVault } from "../utils/storage";
import { writeVaultHash } from "../utils/web3Service";

export default function AddPassword({ vault, masterPassword, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const save = async () => {
    const updated = {
      ...vault,
      accounts: [...vault.accounts, { site, username, password }]
    };

    const encrypted = await encryptVault(updated, masterPassword);
    await saveVault(encrypted);
    await writeVaultHash(encrypted);

    onUpdate(updated);
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <button className="secondary" onClick={() => setOpen(true)}>
          ➕ Add Password
        </button>
      )}

      {open && (
        <div className="card">
          <input placeholder="Website" onChange={e => setSite(e.target.value)} />
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <button className="primary" onClick={save}>Save</button>
          <button className="ghost" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}
