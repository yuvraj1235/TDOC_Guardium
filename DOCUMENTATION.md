# TDOC Guardium - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Installation Guide](#installation-guide)
5. [File Structure & Descriptions](#file-structure--descriptions)
6. [Key Components](#key-components)
7. [How It Works](#how-it-works)
8. [Available Scripts](#available-scripts)
9. [Configuration](#configuration)
10. [Security Considerations](#security-considerations)

---

## 🎯 Project Overview

**Guardium** is a decentralized password manager built as a Chrome extension that integrates Web3 and MetaMask. It allows users to:

- Securely store encrypted passwords locally using the Web Crypto API
- Connect to their Ethereum wallet via MetaMask
- Store a cryptographic fingerprint of their vault on the blockchain via the VaultRegistry smart contract
- Manage passwords with a clean, intuitive React interface
- Verify vault integrity on-chain without storing sensitive data

**Key Philosophy**: No passwords, keys, or encrypted vault data are stored on-chain. Only a cryptographic hash (fingerprint) of the encrypted vault is recorded for verification purposes.

---

## 🛠 Tech Stack

### Frontend & UI
- **React 18.0** - UI framework for component-based architecture
- **React DOM 18.0** - DOM rendering library
- **CSS Modules** - Scoped CSS styling via css-modulesify

### Blockchain & Web3
- **ethers.js (v5.8.0)** - Ethereum library for smart contract interaction and wallet management
- **web3.js (v1.7.3)** - Alternative Web3 library
- **MetaMask Extension Provider (v3.0.0)** - Secure provider for Chrome extension environment
- **Solidity ^0.8.20** - Smart contract language

### Build & Development Tools
- **Gulp 4.0.2** - Task automation and build pipeline
- **Browserify 17.0** - JavaScript bundler
- **Babel 7.x** - JavaScript transpiler for ES6+ syntax
- **Babelify 10.0** - Browserify transform using Babel
- **Gulp Connect 5.7** - Local development server

### Testing & Quality
- **React Scripts 5.0.1** - Create React App build tools
- **Jest** - Testing framework (integrated with react-scripts)
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **ESLint** - Code quality/linting via gulp-eslint-new

### Cryptography
- **Web Crypto API** - Native browser encryption (AES-GCM, PBKDF2)
- **CryptoJS** - Additional cryptographic utilities
- **crypto-js vendor library** - Vendored in project

### Development Utilities
- **patch-package** - Patches for node_modules modifications
- **Truffle (implied)** - Smart contract development framework
- **Vinyl Source Stream** - Vinyl adapter for vinyl-fs

---

## 🏗 Project Architecture

```
┌─────────────────────────────────────────────────────┐
│         Chrome Extension (Manifest v3)              │
│                   (manifest.json)                   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────────┐   ┌──────▼──────────┐
   │  Popup UI    │   │  Content Script  │
   │ (React App)  │   │  (Event Handler) │
   └────┬─────────┘   └──────────────────┘
        │
   ┌────▼─────────────────────────────────┐
   │     React Application (App.js)       │
   │  ├─ Header (UI top bar)              │
   │  ├─ Login (Authentication)           │
   │  ├─ Vault (Display passwords)        │
   │  └─ AddPassword (Add new entries)    │
   └────┬─────────────────────────────────┘
        │
   ┌────▼─────────────────────────────────┐
   │     Utility Services & Contexts      │
   │  ├─ WalletProvider (Wallet mgmt)     │
   │  ├─ CryptoService (Encryption)       │
   │  ├─ web3Service (Blockchain)         │
   │  ├─ storage.js (Local storage)       │
   │  └─ events.js (Event emitter)        │
   └────┬─────────────────────────────────┘
        │
   ┌────▼─────────────────────────────────┐
   │   Smart Contract (Ethereum)          │
   │     VaultRegistry.sol                │
   │  - Stores vault hashes on-chain      │
   │  - Verifies vault integrity          │
   └──────────────────────────────────────┘
```

---

## 📦 Installation Guide

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Chrome Browser** (for extension testing)
- **MetaMask Extension** (for Web3 interaction)
- **Ganache CLI** (for local blockchain testing)

### Step 1: Clone & Install Dependencies

```bash
cd /home/yuvlux/Downloads/TDOC_Guardium
npm install
```

This will:
- Install all npm dependencies listed in `package.json`
- Run `postinstall` script to apply patches via patch-package

### Step 2: Set Up Local Blockchain (Ganache)

```bash
# Install Ganache globally (if not already installed)
npm install -g ganache-cli

# Start Ganache on port 8545 (default)
ganache-cli
```

The WalletProvider expects chain ID `0x539` (Ganache default = 1337).

### Step 3: Deploy Smart Contract

```bash
# Install Truffle globally (if not already installed)
npm install -g truffle

# Compile the smart contract
truffle compile

# Deploy to Ganache
truffle migrate
```

This deploys `VaultRegistry.sol` to Ganache. Note the contract address and update `VAULT_REGISTRY_ADDRESS` in [src/utils/web3Service.js](src/utils/web3Service.js) if needed.

### Step 4: Build the Extension

```bash
# Development build with watch mode
npm start

# Or production build
npm run build
```

This runs Gulp tasks to:
- Transpile React with Babel
- Bundle with Browserify
- Process CSS Modules
- Generate dist/ folder

### Step 5: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Navigate to the `dist/` folder in the project directory
5. The extension will appear in your Chrome toolbar

### Step 6: Configure MetaMask

1. Install MetaMask extension if not present
2. Create/import an account
3. Add custom RPC network:
   - Network Name: Ganache
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

4. Click the Guardium extension icon to open the popup

---

## 📁 File Structure & Descriptions

### Root Level Configuration Files

| File | Purpose |
|------|---------|
| [package.json](package.json) | NPM dependencies, scripts, and project metadata |
| [manifest.json](manifest.json) | Chrome extension configuration (permissions, popup, icons) |
| [truffle-config.js](truffle-config.js) | Truffle smart contract configuration |
| [gulpfile.js](gulpfile.js) | Gulp build pipeline tasks |
| [README.md](README.md) | Original project README |

### Build Output

```
build/
└── contracts/
    └── VaultRegistry.json       # Compiled contract ABI and bytecode
```

### Smart Contracts

```
contracts/
└── VaultRegistry.sol            # Ethereum smart contract for vault hash storage
```

**VaultRegistry.sol Functions:**
- `updateVaultHash(bytes32)` - Register/update encrypted vault hash
- `getVaultHash(address)` - Retrieve vault hash for a user
- `vaultHashes` - Mapping of user address → vault hash

### Migrations

```
migrations/
└── 2_deploy_contracts.js        # Truffle deployment script for VaultRegistry
```

### Public Assets

```
public/
├── index.html                   # Main popup HTML (React root)
├── popup.html                   # Alternative popup template
├── manifest.json                # Chrome extension manifest
└── robots.txt                   # Search engine directives
```

### React Source Code

```
src/
├── App.js                       # Main React component (authentication & UI flow)
├── App.css                      # Main application styles
├── index.js                     # React DOM entry point
├── index.css                    # Global styles
├── reportWebVitals.js           # Performance monitoring
├── setupTests.js                # Jest test configuration
├── App.test.js                  # App component tests
│
├── components/                  # React UI Components
│   ├── Header.js               # Top navigation bar
│   ├── Login.js                # Authentication component (master password)
│   ├── Vault.js                # Display stored passwords
│   ├── AddPassword.js          # Add new password form
│   ├── StatusBar.js            # Wallet/network status indicator
│   └── Toast.js                # Notification/alert component
│
├── context/                     # React Context API
│   └── WalletProvider.js       # Global wallet state management (MetaMask)
│
└── utils/                       # Utility services & helpers
    ├── CryptoService.js        # AES-GCM encryption/decryption
    ├── web3Service.js          # Ethereum contract interaction
    ├── storage.js              # Chrome storage API wrapper
    ├── ContentScript.js        # Chrome content script
    ├── Tabs.js                 # Chrome tabs API wrapper
    ├── events.js               # Custom event emitter
    ├── index.js                # Helper functions
    └── vendor/
        └── crypto-js.js        # Cryptographic library
```

### Test Files

```
test/                           # Smart contract tests
```

---

## 🧩 Key Components

### 1. **App.js** - Main Application Component
- **Purpose**: Root component managing app state
- **State**: 
  - `vault` - User's decrypted password data
  - `masterPassword` - Master password for encryption
- **Flow**: Shows Login → On success shows Vault + AddPassword
- **Key Imports**: Header, Login, Vault, AddPassword

### 2. **WalletProvider.js** - Wallet Context Provider
- **Purpose**: Global wallet state management
- **State Management**:
  - `account` - User's Ethereum address
  - `chainId` - Connected blockchain ID
  - `provider` - ethers.js provider instance
  - `signer` - Signing wallet
  - `isConnected` - Connection status
- **Key Functions**:
  - `connectWallet()` - Initiates MetaMask connection
  - `connectEagerly()` - Auto-connects if previously connected
  - `disconnectWallet()` - Disconnects wallet
- **Network Requirement**: Ganache (Chain ID: 0x539)

### 3. **CryptoService.js** - Encryption/Decryption Service
- **Purpose**: Handle client-side vault encryption
- **Encryption Method**: AES-256-GCM (industry standard)
- **Key Derivation**: PBKDF2 with 200,000 iterations
- **Key Functions**:
  - `deriveKey(password, salt)` - Derives encryption key from master password
  - `encryptVault(data, password)` - Encrypts vault with master password
  - `decryptVault(vault, password)` - Decrypts vault
- **Output Format**: 
  ```javascript
  {
    ciphertext: "base64-encoded-encrypted-data",
    iv: [array of 12 bytes],
    salt: [array of 16 bytes]
  }
  ```

### 4. **web3Service.js** - Blockchain Interaction
- **Purpose**: Interface with VaultRegistry smart contract
- **Config**:
  - Contract Address: `0x21cBB414F4C6B0646040D9Dc2e7D5189aD6dfA15`
  - ABI: updateVaultHash, getVaultHash
- **Key Functions**:
  - `getProvider()` - Gets ethers.js provider (extension-safe)
  - `getContract(withSigner)` - Returns contract instance
  - `updateVaultHash(hash)` - Stores vault hash on blockchain
  - `getVaultHash(address)` - Retrieves vault hash from blockchain

### 5. **storage.js** - Chrome Storage Wrapper
- **Purpose**: Abstraction over Chrome extension storage API
- **Methods**:
  - `get(key)` - Retrieve stored data
  - `set(key, value)` - Store data
  - `remove(key)` - Delete stored data
- **Scope**: Extension-specific storage (not shared with web)

### 6. **Login.js** - Authentication Component
- **Purpose**: Master password entry and vault unlock
- **Process**:
  1. User enters master password
  2. Component retrieves encrypted vault from storage
  3. Attempts decryption with provided password
  4. On success: passes decrypted vault to parent (App.js)
  5. On failure: displays error toast

### 7. **Vault.js** - Password Display Component
- **Purpose**: Display stored passwords
- **Features**:
  - List all stored passwords
  - Show/hide password toggle
  - Copy to clipboard functionality
  - Delete password option

### 8. **AddPassword.js** - Add New Password Component
- **Purpose**: Create and store new password entries
- **Process**:
  1. User enters website URL, username, password
  2. Component encrypts new entry with master password
  3. Adds entry to vault
  4. Stores updated encrypted vault
  5. Updates blockchain hash
  6. Refreshes display

### 9. **Header.js** - Top Navigation
- **Purpose**: UI header with branding
- **Features**: Title, wallet connection status

### 10. **StatusBar.js** - Status Indicator
- **Purpose**: Display wallet and network status
- **Shows**: Connected account, chain ID, connection status

---

## 🔄 How It Works

### User Flow

#### 1. **Extension Load**
```
User clicks Guardium icon
    ↓
Extension opens popup (index.html)
    ↓
React renders App.js
    ↓
WalletProvider auto-connects to MetaMask (if previously connected)
```

#### 2. **First Time Setup (No Vault)**
```
User sees Login component
    ↓
User sets master password (creates new vault)
    ↓
Vault is encrypted locally with AES-256-GCM
    ↓
Encrypted vault stored in Chrome storage
    ↓
User clicks "Create Vault"
    ↓
CryptoService encrypts empty vault with master password
    ↓
web3Service stores vault hash on VaultRegistry contract
    ↓
User proceeds to Vault view
```

#### 3. **Adding Password**
```
User enters website, username, password in AddPassword form
    ↓
Component retrieves current encrypted vault
    ↓
Decrypts with master password
    ↓
Adds new password entry
    ↓
Re-encrypts entire vault
    ↓
Stores updated encrypted vault
    ↓
Computes new hash and updates on blockchain
    ↓
Vault display refreshes with new entry
```

#### 4. **Later Login (Vault Exists)**
```
User clicks Guardium icon
    ↓
Sees Login component with encrypted vault in storage
    ↓
User enters master password
    ↓
CryptoService attempts decryption
    ↓
If successful: vault unlocked, shows stored passwords
    ↓
If failed: shows error toast, prompts retry
```

### Data Flow Diagram

```
┌──────────────────┐
│   Master Password │ (never stored)
└────────┬─────────┘
         │
         ├──────────────────────────────┐
         │                              │
    ┌────▼──────────────────┐    ┌─────▼──────────────────┐
    │ CryptoService.encrypt │    │ CryptoService.decrypt  │
    │ (AES-256-GCM)         │    │ (AES-256-GCM)          │
    └────┬──────────────────┘    └─────┬──────────────────┘
         │                             │
    ┌────▼──────────────────────────────▼─┐
    │   Encrypted Vault Blob              │
    │  ├─ ciphertext (base64)             │
    │  ├─ iv (12 bytes)                   │
    │  └─ salt (16 bytes)                 │
    └────┬──────────────────────────────┬─┘
         │                              │
    ┌────▼─────────────────┐    ┌──────▼────────────────┐
    │  Chrome Storage      │    │  Blockchain (on-chain)│
    │  (Local Storage)     │    │  VaultRegistry        │
    │  [Encrypted Vault]   │    │  [Hash Only]          │
    └─────────────────────┘    └───────────────────────┘
                                (keccak256 hash)
```

---

## 📜 Available Scripts

### Development
```bash
npm start
```
- Runs `gulp watch connect`
- Starts Gulp watch task for file changes
- Launches local dev server on http://localhost:8080
- Auto-rebuilds on source file changes
- Hot reload for React components

### Production Build
```bash
npm run build
```
- Runs default Gulp task
- Bundles React with Browserify + Babel
- Optimizes CSS with css-modulesify
- Generates dist/ folder ready for extension upload

### Testing
```bash
npm test
```
- Runs Jest test suite
- Watches for test file changes
- Uses @testing-library/react for component testing

### Post Install
```bash
npm run postinstall
```
- Automatically runs after `npm install`
- Applies patches from patches/ folder via patch-package
- Fixes any node_modules issues (e.g., css-modulesify compatibility)

---

## ⚙️ Configuration

### manifest.json - Chrome Extension Config
```json
{
  "manifest_version": 3,
  "name": "Guardium",
  "description": "Password manager",
  "version": "1.0",
  "action": {
    "default_popup": "index.html",  // Popup UI
    "default_title": "Open Nft Prize Locker"
  },
  "permissions": [
    "activeTab",        // Access active tab
    "tabs",             // Access all tabs
    "webNavigation",    // Monitor navigation
    "storage"           // Chrome storage API
  ]
}
```

### WalletProvider - Chain Configuration
```javascript
const REQUIRED_CHAIN_ID = "0x539";  // Ganache default
```
Must switch MetaMask to Ganache network before using extension.

### VaultRegistry - Contract Config
```javascript
VAULT_REGISTRY_ADDRESS = "0x21cBB414F4C6B0646040D9Dc2e7D5189aD6dfA15"
VAULT_REGISTRY_ABI = [
  "function updateVaultHash(bytes32 vaultHash)",
  "function getVaultHash(address user) view returns (bytes32)",
]
```

### CryptoService - Encryption Config
```javascript
// PBKDF2 Configuration
iterations: 200000     // High iterations for security
hash: "SHA-256"        // Secure hash algorithm

// AES-GCM Configuration
algorithm: "AES-GCM"   // Industry standard encryption
keyLength: 256         // 256-bit encryption key
```

---

## 🔒 Security Considerations

### ✅ What's Secure

1. **Local Encryption**
   - All passwords encrypted with AES-256-GCM on client-side
   - Master password never sent to server or blockchain
   - Encryption keys derived with PBKDF2 (200,000 iterations)

2. **Zero Knowledge Proof**
   - Only vault hash stored on-chain
   - No actual password data anywhere on blockchain
   - No server stores user data

3. **Master Password**
   - No master password is stored
   - Only used for deriving encryption keys
   - Computed fresh each session

4. **Chrome Storage**
   - Extension storage is isolated per extension
   - Not accessible to other extensions/websites

### ⚠️ Important Security Notes

1. **Master Password is Critical**
   - If lost, vault cannot be recovered
   - No "password reset" mechanism
   - Write it down or use a trusted password manager

2. **MetaMask Security**
   - MetaMask wallet is needed for blockchain operations
   - Extension relies on MetaMask's security
   - Keep MetaMask and Chrome updated

3. **Blockchain Risks**
   - Storing on Ganache (local/testnet) has no security guarantee
   - In production, would require mainnet or secure testnet
   - Consider smart contract audits for production

4. **Extension Risks**
   - Chrome extension runs in browser context
   - Could be targeted by browser exploits
   - Keep browser and extensions updated
   - Only install from official Chrome Web Store

### 🛡️ Best Practices

```javascript
// ✅ DO
- Use strong master password (16+ characters, mixed case, numbers, symbols)
- Keep MetaMask secure and updated
- Back up wallet seed phrase separately
- Test recovery process
- Keep Chrome and all extensions updated

// ❌ DON'T
- Share master password
- Store master password in browsers
- Use same password elsewhere
- Install from untrusted sources
- Use on public/shared computers
```

---

## 📚 Additional Resources

### Smart Contract Documentation
- **Solidity**: https://docs.soliditylang.org/
- **Truffle**: https://trufflesuite.com/docs/

### Web3 Libraries
- **ethers.js**: https://docs.ethers.io/
- **Web3.js**: https://web3js.readthedocs.io/

### Chrome Extension Development
- **Manifest v3**: https://developer.chrome.com/docs/extensions/mv3/
- **Storage API**: https://developer.chrome.com/docs/extensions/reference/storage/

### Web Crypto API
- **MDN Web Crypto**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- **AES-GCM**: https://en.wikipedia.org/wiki/Galois/Counter_Mode

### React Documentation
- **React 18**: https://react.dev/
- **React Context**: https://react.dev/reference/react/useContext

---

## 🐛 Troubleshooting

### Extension Won't Load
1. Check manifest.json syntax
2. Ensure dist/ folder exists (run `npm run build`)
3. Check browser console for errors (F12)

### MetaMask Not Connecting
1. Verify MetaMask is installed
2. Switch MetaMask to Ganache network (Chain ID: 1337)
3. Check that Ganache is running (http://localhost:8545)

### Vault Won't Decrypt
1. Verify master password is correct
2. Check Chrome storage has encrypted vault
3. Ensure CryptoService uses same salt/IV from storage

### Smart Contract Errors
1. Verify contract is deployed (run `truffle migrate`)
2. Update VAULT_REGISTRY_ADDRESS if needed
3. Check Ganache is running

### Build Errors
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check Node.js version (14+)
3. Review Gulp and Browserify configuration

---

## 📝 License & Credits

- **Original Boilerplate**: chrome-extension-react-metamask-boilerplate
- **Modified for**: Guardium Password Manager
- **Blockchain**: Ganache (local Ethereum development)
- **Framework**: React 18 + Web3.js + ethers.js

---

**Last Updated**: December 16, 2025  
**Project Status**: Development/Testing  
**Maintainer**: TDOC_Guardium Team
