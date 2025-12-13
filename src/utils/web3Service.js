import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";

// -----------------------------------
// CONFIG
// -----------------------------------
export const VAULT_REGISTRY_ADDRESS =
  "0x2c4cb8ddD0BDb6081B60527Ddd1FA64Cb69161b0";

export const VAULT_REGISTRY_ABI = [
  "function updateKeyHash(string _hmk) public",
  "function getKeyHash() public view returns (string)",
];

// -----------------------------------
// PROVIDER LOADING (WORKS IN EXTENSION POPUP)
// -----------------------------------
let cachedProvider = null;

async function getProvider() {
  if (cachedProvider) return cachedProvider;

  let injected = window.ethereum;

  // 1️⃣ If exists — good (ONLY for normal webpages, rarely popup)
  if (injected) {
    console.log("Using window.ethereum");
    await injected.request({ method: "eth_requestAccounts" });
    cachedProvider = new ethers.providers.Web3Provider(injected);
    return cachedProvider;
  }

  // 2️⃣ Chrome extension provider (REAL FIX)
  console.log("Using MetaMask Extension Provider");
  const mm = createMetaMaskProvider();

  if (!mm) throw new Error("MetaMask extension provider unavailable");

  await mm.request({ method: "eth_requestAccounts" });

  cachedProvider = new ethers.providers.Web3Provider(mm);
  return cachedProvider;
}

// -----------------------------------
// CONTRACT HELPERS
// -----------------------------------
async function getContract(withSigner = false) {
  const provider = await getProvider();

  if (withSigner) {
    const signer = provider.getSigner();
    return new ethers.Contract(
      VAULT_REGISTRY_ADDRESS,
      VAULT_REGISTRY_ABI,
      signer
    );
  }

  return new ethers.Contract(
    VAULT_REGISTRY_ADDRESS,
    VAULT_REGISTRY_ABI,
    provider
  );
}

// -----------------------------------
// FUNCTIONS
// -----------------------------------
export async function checkUserExists() {
  try {
    const contract = await getContract();
    const hash = await contract.getKeyHash();
    return hash && hash.length > 0;
  } catch (err) {
    console.error("checkUserExists error:", err);
    return false;
  }
}

export async function validateMasterPassword(password) {
  try {
    const contract = await getContract();
    const stored = await contract.getKeyHash();

    const input = ethers.utils.sha256(
      ethers.utils.toUtf8Bytes(password)
    );

    return stored === input;
  } catch (err) {
    console.error("validateMasterPassword error:", err);
    return false;
  }
}

export async function registerMasterPassword(password) {
  try {
    const contract = await getContract(true);

    const inputHash = ethers.utils.sha256(
      ethers.utils.toUtf8Bytes(password)
    );

    const tx = await contract.updateKeyHash(inputHash);
    await tx.wait();

    console.log("Master password stored on-chain");
  } catch (err) {
    console.error("registerMasterPassword error:", err);
    throw err;
  }
}
