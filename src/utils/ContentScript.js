console.log("Guardian content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "FILL_CREDENTIALS") return;

  const inputs = document.querySelectorAll("input");

  let filled = false;

  inputs.forEach(input => {
    const name = (input.name || "").toLowerCase();
    const id = (input.id || "").toLowerCase();
    const type = input.type;

    if (
      type === "email" ||
      type === "text" && (name.includes("user") || name.includes("email") || id.includes("user"))
    ) {
      input.value = msg.username;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      filled = true;
    }

    if (type === "password") {
      input.value = msg.password;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      filled = true;
    }
  });

  sendResponse({ filled });
});
