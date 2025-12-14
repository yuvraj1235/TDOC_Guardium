import React from "react";
import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";
import storage from "../utils/storage";
import { EthereumEvents } from "../utils/events";
import { getNormalizeAddress } from "../utils";

export const WalletContext = React.createContext();
export const useWallet = () => React.useContext(WalletContext);

// Ganache default chainId = 1337 → 0x539
const REQUIRED_CHAIN_ID = "0x539";

const WalletProvider = React.memo(({ children }) => {
  const [account, setAccount] = React.useState(null);
  const [chainId, setChainId] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [isConnected, setConnected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const getProvider = () => {
    try {
      return createMetaMaskProvider();
    } catch {
      return null;
    }
  };

  React.useEffect(() => {
    connectEagerly();
  }, []);

  const connectEagerly = async () => {
    const saved = await storage.get("metamask-connected");
    if (saved?.connected) connectWallet();
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const mm = getProvider();
      if (!mm) throw new Error("MetaMask not available");

      const accounts = await mm.request({ method: "eth_requestAccounts" });
      const chainId = await mm.request({ method: "eth_chainId" });

      if (chainId !== REQUIRED_CHAIN_ID) {
        alert("Please switch to Ganache network");
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(mm);
      const signer = ethersProvider.getSigner();

      setAccount(getNormalizeAddress(accounts));
      setChainId(chainId);
      setProvider(ethersProvider);
      setSigner(signer);
      setConnected(true);

      storage.set("metamask-connected", { connected: true });
      subscribe(mm);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setConnected(false);
    storage.set("metamask-connected", { connected: false });
  };

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

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        provider,
        signer,
        isConnected,
        connectWallet,
        disconnectWallet,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
});

export default WalletProvider;
