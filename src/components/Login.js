import React, { useState, useEffect } from "react";
import {
  checkUserExists,
  validateMasterPassword,
  registerMasterPassword,
} from "../utils/web3Service.js";

export default function Login({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Connecting to MetaMask...");

  // -----------------------------
  // INITIAL CHECK
  // -----------------------------
  useEffect(() => {
    async function init() {
      try {
        const exists = await checkUserExists();

        setIsRegistering(!exists);
        setStatus(exists ? "Unlock your Vault" : "Create Master Password");
      } catch (err) {
        console.error(err);
        setStatus("⚠ MetaMask not connected");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // -----------------------------
  // HANDLE LOGIN / REGISTER
  // -----------------------------
  const handleAuth = async () => {
    if (!password || password.length < 8) {
      alert("Master Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        setStatus("Sign transaction in MetaMask...");
        await registerMasterPassword(password);

        setStatus("Registered ✓ Unlocking...");
        onUnlock(password);
        return;
      }

      // LOGIN MODE
      setStatus("Verifying password...");
      const valid = await validateMasterPassword(password);

      if (!valid) {
        alert("Incorrect Password");
        return;
      }

      setStatus("Unlocking...");
      onUnlock(password);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setStatus(isRegistering ? "Create Master Password" : "Unlock your Vault");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return React.createElement(
    "div",
    { className: "flex flex-col items-center justify-center h-full space-y-4" },
    React.createElement(
      "h1",
      { className: "text-2xl font-bold text-blue-500" },
      "Guardium"
    ),
    React.createElement(
      "p",
      { className: "text-gray-400 text-sm" },
      status
    ),
    React.createElement("input", {
      type: "password",
      placeholder: "Master Password",
      className: "w-full p-2 bg-gray-800 rounded text-white border border-gray-700",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      disabled: loading,
    }),
    React.createElement(
      "button",
      {
        onClick: handleAuth,
        disabled: loading,
        className: "w-full bg-blue-600 p-2 rounded text-white font-bold hover:bg-blue-700 disabled:opacity-50",
      },
      loading
        ? "Processing..."
        : isRegistering
        ? "Register Password"
        : "Unlock Vault"
    ),
    !loading &&
      React.createElement(
        "button",
        {
          onClick: () => {
            setIsRegistering((prev) => !prev);
            setStatus(!isRegistering ? "Unlock your Vault" : "Create Master Password");
          },
          className: "text-xs text-gray-400 hover:text-blue-400",
        },
        isRegistering
          ? "Already registered? Unlock instead"
          : "New user? Register Master Password"
      )
  );
}
