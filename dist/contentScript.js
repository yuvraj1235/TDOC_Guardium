console.log("Guardium: Content script loaded (Live Sync Mode)");
// ... existing code (setNativeValue, fillCredentials, etc.) ...


// --- Fixed Helper: Safely set value for React/Angular/Vue forms ---
function setNativeValue(element, value) {
  // Try to find the setter on the element's prototype
  const prototype = Object.getPrototypeOf(element);
  let descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

  // If not found, look up the chain or use the global HTMLInputElement prototype
  if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  }

  // If we found a setter, call it to bypass React's override
  if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
  } else {
      element.value = value;
  }
  
  // Dispatch events so the framework notices the change
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function isExtensionContextValid() {
  return typeof chrome !== "undefined" && chrome.runtime && !!chrome.runtime.id;
}

function fillCredentials(passwordInput, credentials) {
  if (!credentials) return;

  console.log("Guardium: Filling password");
  setNativeValue(passwordInput, credentials.password);

  // Heuristic: Look for the username field strictly before the password field
  const inputs = Array.from(document.querySelectorAll('input'));
  const passIndex = inputs.indexOf(passwordInput);
  
  if (passIndex > 0) {
    // Search backwards for the nearest visible text/email input
    for (let i = passIndex - 1; i >= 0; i--) {
        const prevInput = inputs[i];
        if (prevInput.type === "text" || prevInput.type === "email") {
            // Check visibility (simple check)
            if (prevInput.offsetParent !== null) { 
                console.log("Guardium: Filling username");
                setNativeValue(prevInput, credentials.username);
                break; // Stop after filling one username
            }
        }
    }
  }
}

function attachListeners(passwordInput) {
  if (passwordInput.dataset.guardiumAttached) return;
  passwordInput.dataset.guardiumAttached = "true";

  passwordInput.addEventListener("focus", () => {
    if (!isExtensionContextValid()) return;

    try {
      chrome.runtime.sendMessage(
        { type: "REQUEST_CREDENTIALS", site: window.location.hostname },
        (response) => {
          if (chrome.runtime.lastError) {
            // Suppress standard error if popup is closed
            return;
          }
          if (response && response.credentials) {
            fillCredentials(passwordInput, response.credentials);
          }
        }
      );
    } catch (err) {
      // Ignore context invalidated errors
    }
  });
}

function detectPasswordInputs() {
  document.querySelectorAll('input[type="password"]').forEach(attachListeners);
}

const observer = new MutationObserver(detectPasswordInputs);
observer.observe(document.documentElement, { childList: true, subtree: true });

detectPasswordInputs();
// ✅ NEW: Listen for manual fill requests from the Popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "FILL_CREDENTIALS" && msg.credentials) {
    
    // 1. Find the best fields to fill
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (passwordInput) {
      // Reuse the robust filling logic we wrote earlier
      fillCredentials(passwordInput, msg.credentials);
      sendResponse({ filled: true });
    } else {
      console.warn("Guardium: No password field found for manual fill.");
      sendResponse({ filled: false });
    }
  }
});
// Helper: Find username near the password
function findUsernameField(passwordInput) {
  const inputs = Array.from(document.querySelectorAll('input'));
  const passIndex = inputs.indexOf(passwordInput);
  for (let i = passIndex - 1; i >= 0; i--) {
    const input = inputs[i];
    if ((input.type === "text" || input.type === "email") && input.offsetParent !== null) {
      return input;
    }
  }
  return null;
}

// THE FIX: Send data immediately when typing stops
let typingTimer;
function syncToBackground(passwordInput) {
  clearTimeout(typingTimer);
  
  // Wait 0.5 seconds after typing stops to avoid spamming
  typingTimer = setTimeout(() => {
    if (passwordInput.value.length === 0) return; // Don't save empty clears

    const usernameField = findUsernameField(passwordInput);
    const credentials = {
      username: usernameField ? usernameField.value : "",
      password: passwordInput.value,
      site: window.location.hostname
    };

    console.log("Guardium: Syncing draft...", credentials.username);

    // Send to background NOW (Before user clicks login)
    try {
      chrome.runtime.sendMessage({ 
        type: "QUEUE_CREDENTIALS", 
        data: credentials 
      });
    } catch (e) {
      // Connection might fail if extension updated
    }
  }, 500);
}

// Listen for typing on ANY password field
document.addEventListener('input', (e) => {
  if (e.target.type === 'password') {
    syncToBackground(e.target);
  }
}, true);

// Also sync on 'change' (autofill detection)
document.addEventListener('change', (e) => {
  if (e.target.type === 'password') {
    syncToBackground(e.target);
  }
}, true);