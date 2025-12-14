import React from "react";
import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";
import { EthereumEvents } from "../utils/events";
import { getNormalizeAddress } from "../utils";

export const WalletContext = React.createContext();
export const useWallet = () => React.useContext(WalletContext);

const REQUIRED_CHAIN_ID = "0x539"; // Ganache
const UNLOCK_MESSAGE = "Unlock Guardian Vault v1";

/* =====================================================
   INTERNAL HELPER (sendAsync wrapper)
===================================================== */

function mmRequest(mm, method, params = []) {
  return new Promise((resolve, reject) => {
    mm.sendAsync(
      {
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params,
      },
      (err, res) => {
        if (err) return reject(err);
        if (res.error) return reject(res.error);
        resolve(res.result);
      }
    );
  });
}

/* =====================================================
   WALLET PROVIDER
===================================================== */

const WalletProvider = ({ children }) => {
  const [account, setAccount] = React.useState(null);
  const [chainId, setChainId] = React.useState(null);
  const [isConnected, setConnected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const getMM = () => {
    const mm = createMetaMaskProvider();
    if (!mm) throw new Error("MetaMask not found");
    return mm;
  };

  /* ---------- CONNECT ---------- */

  const connectWallet = async () => {
    setLoading(true);
    try {
      const mm = getMM();

      const accounts = await mmRequest(mm, "eth_requestAccounts");
      const chainId = await mmRequest(mm, "eth_chainId");

      if (chainId !== REQUIRED_CHAIN_ID) {
        alert("Please switch to Ganache network");
        throw new Error("WRONG_NETWORK");
      }

      setAccount(getNormalizeAddress(accounts));
      setChainId(chainId);
      setConnected(true);

      chrome.storage.local.set({
        "metamask-connected": { connected: true },
      });

      subscribe(mm);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DISCONNECT ---------- */

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setConnected(false);

    chrome.storage.local.set({
      "metamask-connected": { connected: false },
    });
  };

  /* ---------- SIGN (ON DEMAND, NO STATE) ---------- */

  const signUnlockMessage = async () => {
    const mm = getMM();
    const accounts = await mmRequest(mm, "eth_requestAccounts");

    const provider = new ethers.providers.Web3Provider(mm);
    const signer = provider.getSigner();

    return signer.signMessage(UNLOCK_MESSAGE);
  };

  /* ---------- EVENTS ---------- */

  const subscribe = (mm) => {
    if (!mm?.on) return;

    mm.on(EthereumEvents.ACCOUNTS_CHANGED, (accounts) => {
      if (!accounts.length) return disconnectWallet();
      setAccount(getNormalizeAddress(accounts));
    });

    mm.on(EthereumEvents.CHAIN_CHANGED, (id) => {
      if (id !== REQUIRED_CHAIN_ID) disconnectWallet();
      setChainId(id);
    });

    mm.on(EthereumEvents.DISCONNECT, disconnectWallet);
  };

  /* ---------- AUTO RECONNECT ---------- */

  React.useEffect(() => {
    chrome.storage.local.get("metamask-connected").then((res) => {
      if (res?.["metamask-connected"]?.connected) {
        connectWallet();
      }
    });
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnected,
        loading,
        connectWallet,
        disconnectWallet,
        signUnlockMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
