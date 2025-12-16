import React from "react";

function StatusBar({ text, type }) {
  return (
    <div style={getStatusStyle(type)}>
      <div style={styles.glow(type)}></div>
      <div style={styles.content}>
        {getIcon(type)}
        <span>{text}</span>
      </div>
    </div>
  );
}

function getIcon(type) {
  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚠',
    info: 'ℹ'
  };
  
  if (!icons[type]) return null;
  
  return <span style={styles.icon}>{icons[type]}</span>;
}

function getStatusStyle(type) {
  const baseStyle = {
    position: 'relative',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const typeStyles = {
    success: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      color: '#10b981'
    },
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      color: '#ef4444'
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      color: '#f59e0b'
    },
    info: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      color: '#3b82f6'
    }
  };

  return {
    ...baseStyle,
    ...(typeStyles[type] || {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      borderColor: 'rgba(107, 114, 128, 0.3)',
      color: '#9ca3af'
    })
  };
}

const styles = {
  glow: (type) => {
    const glowColors = {
      success: 'rgba(16, 185, 129, 0.2)',
      error: 'rgba(239, 68, 68, 0.2)',
      warning: 'rgba(245, 158, 11, 0.2)',
      info: 'rgba(59, 130, 246, 0.2)'
    };

    return {
      position: 'absolute',
      inset: 0,
      background: glowColors[type] || 'rgba(107, 114, 128, 0.1)',
      filter: 'blur(8px)',
      opacity: 0.5,
      pointerEvents: 'none'
    };
  },
  content: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 1
  },
  icon: {
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default function App() {
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      {/* Background effects like Login.js */}
      <div style={styles.bgEffects}>
        <div style={styles.pinkBlur}></div>
        <div style={styles.blueBlur}></div>
      </div>

      <div style={styles.demoContent}>
        <h1 style={styles.title}>Status Bar Component</h1>
        <p style={styles.subtitle}>Matching GUARDIUM Design System</p>
        
        <div style={styles.statusList}>
          <StatusBar text="Vault created successfully" type="success" />
          <StatusBar text="Failed to decrypt vault - wrong password" type="error" />
          <StatusBar text="Blockchain verification in progress..." type="warning" />
          <StatusBar text="Vault integrity verified on blockchain" type="info" />
          <StatusBar text="Initializing..." type="" />
          <StatusBar text="Creating vault..." type="info" />
          <StatusBar text="Registering on blockchain..." type="info" />
        </div>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

styles.container = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#000000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box'
};

styles.bgEffects = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none'
};

styles.pinkBlur = {
  position: 'absolute',
  top: '10%',
  left: '20%',
  width: '150px',
  height: '150px',
  backgroundColor: 'rgba(219, 39, 119, 0.3)',
  borderRadius: '50%',
  filter: 'blur(60px)',
  animation: 'pulse 3s infinite'
};

styles.blueBlur = {
  position: 'absolute',
  bottom: '10%',
  right: '20%',
  width: '150px',
  height: '150px',
  backgroundColor: 'rgba(59, 130, 246, 0.3)',
  borderRadius: '50%',
  filter: 'blur(60px)',
  animation: 'pulse 3s infinite 1.5s'
};

styles.demoContent = {
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px'
};

styles.title = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
  background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.1em',
  textAlign: 'center'
};

styles.subtitle = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: 0,
  textAlign: 'center'
};

styles.statusList = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};
