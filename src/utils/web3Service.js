import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";

/* =====================================================
   CONFIG
===================================================== */

export const VAULT_REGISTRY_ADDRESS =
  "0x21cBB414F4C6B0646040D9Dc2e7D5189aD6dfA15";

export const VAULT_REGISTRY_ABI = [
  "function updateVaultHash(bytes32 _vaultHash)",
  "function getVaultHash(address user) view returns (bytes32)",
  "function verifyVault(address user, bytes32 localHash) view returns (bool)",
];

const UNLOCK_MESSAGE = "Unlock Guardian Vault v1";

/* =====================================================
   METAMASK PROVIDER (EXTENSION SAFE)
===================================================== */

let cachedProvider = null;

function mmRequest(mm, method, params = []) {
  return new Promise((resolve, reject) => {
    mm.sendAsync(
      {
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params,
      },
      (err, response) => {
        if (err) return reject(err);
        if (response.error) return reject(response.error);
        resolve(response.result);
      }
    );
  });
}

async function getProvider() {
  if (cachedProvider) return cachedProvider;

  const mm = createMetaMaskProvider();
  if (!mm) throw new Error("MetaMask not found");

  await mmRequest(mm, "eth_requestAccounts");

  const provider = new ethers.providers.Web3Provider(mm);
  cachedProvider = provider;
  return provider;
}

/* =====================================================
   CONTRACT
===================================================== */

async function getContract(withSigner = false) {
  const provider = await getProvider();

  return new ethers.Contract(
    VAULT_REGISTRY_ADDRESS,
    VAULT_REGISTRY_ABI,
    withSigner ? provider.getSigner() : provider
  );
}

/* =====================================================
   WALLET
===================================================== */

export async function getUserAddress() {
  const provider = await getProvider();
  return provider.getSigner().getAddress();
}

export async function signUnlockMessage() {
  const provider = await getProvider();
  return provider.getSigner().signMessage(UNLOCK_MESSAGE);
}

/* =====================================================
   VAULT HASH
===================================================== */

export function computeVaultHash(encryptedVault) {
  if (!encryptedVault) {
    throw new Error("NO_VAULT_PROVIDED");
  }

  const canonical = JSON.stringify(encryptedVault);

  return ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(canonical)
  );
}

/* =====================================================
   BLOCKCHAIN ACTIONS
===================================================== */

export async function writeVaultHash(encryptedVault) {
  const hash = computeVaultHash(encryptedVault);
  const contract = await getContract(true);

  const tx = await contract.updateVaultHash(hash);
  await tx.wait();
}

export async function readVaultHash(address) {
  const contract = await getContract();
  return contract.getVaultHash(address);
}

export async function verifyVault(encryptedVault) {
  const hash = computeVaultHash(encryptedVault);
  const contract = await getContract();

  const user = await getUserAddress();
  return contract.verifyVault(user, hash);
}
