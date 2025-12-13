import React from "react";
import createMetaMaskProvider from "metamask-extension-provider";
import Web3 from "web3";
import storage from "../utils/storage";
import { EthereumEvents } from "../utils/events";
import { getNormalizeAddress } from "../utils";

export const WalletContext = React.createContext();
export const useWallet = () => React.useContext(WalletContext);

const WalletProvider = React.memo(({ children }) => {
  const [account, setAccount] = React.useState(null);
  const [chainId, setChainId] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  /** ------------------------------------------------------------------
   * ALWAYS USE METAMASK EXTENSION PROVIDER
   * popup NEVER gets window.ethereum 
   -------------------------------------------------------------------*/
  const getProvider = () => {
    try {
      const provider = createMetaMaskProvider();
      console.log("MetaMask extension provider loaded:", provider);
      return provider;
    } catch (err) {
      console.error("Could not load MetaMask extension provider:", err);
      return null;
    }
  };

  /** AUTO RECONNECT */
  React.useEffect(() => {
    connectEagerly();
  }, []);

  const connectEagerly = async () => {
    const saved = await storage.get("metamask-connected");
    if (saved?.connected) {
      await connectWallet();
    }
  };

  /** MAIN CONNECT FUNCTION */
  const connectWallet = async () => {
    setLoading(true);
    try {
      const provider = getProvider();
      if (!provider) throw new Error("MetaMask provider unavailable");

      /** request accounts */
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      /** get chain id */
      const chainId = await provider.request({ method: "eth_chainId" });

      const normalized = getNormalizeAddress(accounts);

      setAccount(normalized);
      setChainId(chainId);
      setAuthenticated(true);

      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      storage.set("metamask-connected", { connected: true });

      subscribe(provider);

      console.log("Wallet connected:", normalized);
    } catch (err) {
      console.error("Connect Wallet Error:", err);
    }
    setLoading(false);
  };

  /** DISCONNECT */
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setWeb3(null);
    setAuthenticated(false);
    storage.set("metamask-connected", { connected: false });
  };

  /** EVENT HANDLERS */
  const subscribe = (provider) => {
    if (!provider?.on) return;

    provider.on(EthereumEvents.ACCOUNTS_CHANGED, (accounts) => {
      if (accounts.length === 0) return disconnectWallet();
      setAccount(getNormalizeAddress(accounts));
    });

    provider.on(EthereumEvents.CHAIN_CHANGED, (id) => {
      setChainId(id);
    });

    provider.on(EthereumEvents.DISCONNECT, () => {
      disconnectWallet();
    });
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        web3,
        isAuthenticated,
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
