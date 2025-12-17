/* src/components/Intro.js */
import React, { useState, useEffect } from "react";

export default function Intro({ onComplete }) {
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkMetaMask();
  }, []);

  const checkMetaMask = async () => {
    setChecking(true);
    setError("");

    try {
      // 1. Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // 🛑 Edge Case: Cannot check on browser settings pages
      if (!tab || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
        setHasMetaMask(false);
        setError("Please visit a normal website (like Google) to enable detection.");
        setChecking(false);
        return;
      }

      // 2. 💉 INJECT A CHECK INTO THE REAL WEBPAGE (Main World)
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN", // <--- Important: Runs in the page context where Ethereum lives
        func: () => {
          // This code runs inside the browser tab, not the extension
          return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
        },
      });

      // 3. Process Result
      if (results && results[0] && results[0].result === true) {
        setHasMetaMask(true);
      } else {
        setHasMetaMask(false);
      }
    } catch (err) {
      console.warn("Detection failed:", err);
      setHasMetaMask(false); // Assume missing on error
    } finally {
      setChecking(false);
    }
  };

  // --- UI CONFIGURATION ---
  const slide = hasMetaMask
    ? {
        title: "Guardium",
        subtitle: "Wallet Detected",
        description: "MetaMask found! Your vault will be secured on the blockchain.",
        icon: "🛡️",
        color: "#10b981", // Green
        btnText: "Get Started",
        action: onComplete
      }
    : {
        title: "MetaMask Required",
        subtitle: "Wallet Not Found",
        description: error || "We couldn't detect MetaMask on this tab. Please install it or try reloading.",
        icon: "🦊",
        color: "#f6851b", // Orange
        btnText: "Install MetaMask",
        action: () => window.open("https://metamask.io/download/", "_blank")
      };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      {/* Background Glow */}
      <div style={styles.bgEffects}>
        <div style={{...styles.colorBlur, backgroundColor: slide.color}}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.slideContainer}>
          {/* Icon Animation */}
          <div style={styles.iconContainer}>
            <div style={{...styles.iconCircle, borderColor: slide.color}}>
              <span style={styles.icon}>{slide.icon}</span>
            </div>
          </div>

          <h1 style={styles.title}>{slide.title}</h1>
          <h2 style={{...styles.subtitle, color: hasMetaMask ? '#94a3b8' : '#f6851b'}}>
            {slide.subtitle}
          </h2>
          <p style={styles.description}>{slide.description}</p>
        </div>

        <div style={styles.footer}>
          <button
            onClick={slide.action}
            style={{...styles.nextButton, backgroundColor: slide.color}}
          >
            {slide.btnText}
          </button>

          {/* Retry Button for missed detection */}
          {!hasMetaMask && (
            <button onClick={checkMetaMask} style={styles.linkButton}>
              🔄 Check Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ... (KEEP YOUR EXISTING STYLES & KEYFRAMES BELOW) ...
// Ensure you keep the 'styles' and 'keyframes' objects from your previous code.
// No changes needed there.
const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.25; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styles = {
  container: {
    width: '100vh',
    height: '100%', 
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: '"Ubuntu", "Segoe UI", Roboto, sans-serif'
  },
  bgEffects: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  colorBlur: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '300px', height: '300px', borderRadius: '50%', filter: 'blur(80px)',
    animation: 'pulse 4s infinite ease-in-out', transition: 'background-color 0.6s ease'
  },
  content: {
    position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
  },
  slideContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    textAlign: 'center', animation: 'slideIn 0.5s ease-out', flex: 1,
    justifyContent: 'center', paddingBottom: '40px'
  },
  iconContainer: { marginBottom: '24px' },
  iconCircle: {
    width: '120px', height: '120px', borderRadius: '50%', border: '3px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1e293b', animation: 'float 3s infinite ease-in-out',
    transition: 'border-color 0.6s ease'
  },
  icon: { fontSize: '48px' },
  title: { fontSize: '28px', fontWeight: '700', margin: 0, color: '#e2e8f0' },
  subtitle: { fontSize: '18px', fontWeight: '600', margin: 0, color: '#94a3b8' },
  description: { fontSize: '14px', color: '#64748b', margin: '8px 0 0 0', maxWidth: '280px', lineHeight: '1.6' },
  footer: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingBottom: '16px' },
  nextButton: {
    width: '100%', maxWidth: '280px', padding: '14px', borderRadius: '16px', border: 'none',
    color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease'
  },
  linkButton: {
    background: 'none', border: 'none', color: '#64748b', fontSize: '12px',
    textDecoration: 'underline', cursor: 'pointer'
  }
};