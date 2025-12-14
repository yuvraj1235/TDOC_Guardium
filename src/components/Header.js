import React from "react";
import { useWallet } from "../context/WalletProvider";

export default function Header() {
  const { isConnected, account } = useWallet();

  return (
    <div className="header">
      <h3>🔐 Guardian</h3>
      <small>
        Wallet: {isConnected ? "Connected 🟢" : "Not Connected 🔴"}
      </small>
    </div>
  );
}
