import { useState, useEffect } from "react";
import { loadVault } from "../utils/CryptoService.js";

export default function Vault(props) {
  const masterKey = props.masterKey;
  const onAdd = props.onAdd;
  const onLock = props.onLock;

  const _useState = useState([]);
  const items = _useState[0];
  const setItems = _useState[1];

  const _useState2 = useState(true);
  const loading = _useState2[0];
  const setLoading = _useState2[1];

  const refreshVault = async function () {
    const data = await loadVault(masterKey);
    setItems(data);
  };

  useEffect(function () {
    refreshVault().finally(function () {
      setLoading(false);
    });
  }, [masterKey]);

  return React.createElement(
    "div",
    { className: "h-full flex flex-col" },

    React.createElement(
      "div",
      { className: "flex justify-between items-center mb-4 pb-2 border-b border-gray-700" },
      React.createElement(
        "h2",
        { className: "text-lg font-bold text-white" },
        "My Vault"
      ),
      React.createElement(
        "button",
        { onClick: onLock, className: "text-red-400 text-xs" },
        "Lock"
      )
    ),

    React.createElement(
      "div",
      { className: "flex-1 overflow-y-auto space-y-2" },

      loading &&
        React.createElement(
          "p",
          { className: "text-gray-500 text-center mt-10" },
          "Loading..."
        ),

      !loading && items.length === 0 &&
        React.createElement(
          "p",
          { className: "text-gray-500 text-center mt-10" },
          "No passwords saved."
        ),

      items.map(function (item) {
        return React.createElement(
          "div",
          {
            key: item.id,
            className: "bg-gray-800 p-3 rounded flex justify-between"
          },

          React.createElement(
            "div",
            null,
            React.createElement(
              "p",
              { className: "font-bold text-white" },
              item.site
            ),
            React.createElement(
              "p",
              { className: "text-xs text-gray-400" },
              item.username
            )
          ),

          React.createElement(
            "button",
            {
              onClick: function () {
                navigator.clipboard.writeText(item.password);
                showError("Password copied!");
              },
              className:
                "text-blue-400 text-xs border border-blue-400 px-2 rounded hover:bg-blue-400 hover:text-white"
            },
            "Copy"
          )
        );
      })
    ),

    React.createElement(
      "button",
      {
        onClick: function () {
          onAdd(refreshVault);
        },
        className: "w-full mt-4 bg-green-600 p-2 rounded text-white font-bold"
      },
      "+ Add Password"
    )
  );
}
