import React, { useState } from "react";
import { loadVault, saveVault } from "../utils/CryptoService.js";

export default function AddPassword({ masterKey, onBack, refreshVault }) {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.site.trim() || !form.password.trim()) {
      return alert("Website and Password are required.");
    }

    setSaving(true);

    try {
      const currentVault = await loadVault(masterKey);
      const newItem = {
        id: Date.now(),
        site: form.site.trim(),
        username: form.username.trim(),
        password: form.password.trim(),
      };

      await saveVault([...currentVault, newItem], masterKey);

      if (refreshVault) refreshVault(); // refresh the vault list
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return React.createElement(
    "div",
    { className: "h-full flex flex-col" },
    React.createElement(
      "div",
      { className: "flex items-center mb-4 pb-2 border-b border-gray-700" },
      React.createElement(
        "button",
        { onClick: onBack, className: "text-gray-400 mr-2" },
        "←"
      ),
      React.createElement(
        "h2",
        { className: "text-lg font-bold text-white" },
        "Add Password"
      )
    ),
    React.createElement(
      "div",
      { className: "space-y-3" },
      React.createElement("input", {
        placeholder: "Website",
        className: "w-full p-2 bg-gray-800 rounded text-white",
        value: form.site,
        onChange: (e) => setForm({ ...form, site: e.target.value }),
      }),
      React.createElement("input", {
        placeholder: "Username",
        className: "w-full p-2 bg-gray-800 rounded text-white",
        value: form.username,
        onChange: (e) => setForm({ ...form, username: e.target.value }),
      }),
      React.createElement("input", {
        placeholder: "Password",
        type: "password",
        className: "w-full p-2 bg-gray-800 rounded text-white",
        value: form.password,
        onChange: (e) => setForm({ ...form, password: e.target.value }),
      })
    ),
    React.createElement(
      "button",
      {
        onClick: handleSave,
        disabled: saving,
        className: "w-full mt-4 bg-blue-600 p-2 rounded text-white font-bold disabled:opacity-50",
      },
      saving ? "Saving..." : "Save"
    )
  );
}
