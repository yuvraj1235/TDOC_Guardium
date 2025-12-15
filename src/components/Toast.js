import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  
  const currentStyle = {
    gradient: 'linear-gradient(135deg, #dc2626, #991b1b)',
    glow: 'rgba(220, 38, 38, 0.4)',
    icon: '✕'
  };
  
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      {/* Toast card */}
      <div style={styles.toastWrapper}>
        {/* Glow effect */}
        <div style={{
          ...styles.glow,
          background: currentStyle.gradient,
          boxShadow: `0 0 30px ${currentStyle.glow}`
        }}></div>
        
        {/* Main content */}
        <div style={{
          ...styles.content,
          background: currentStyle.gradient
        }}>
          {/* Icon */}
          <div style={styles.iconWrapper}>
            <span style={styles.icon}>{currentStyle.icon}</span>
          </div>
          
          {/* Message */}
          <span style={styles.message}>{message}</span>
        </div>

        {/* Circuit lines decoration */}
        <div style={styles.circuitLeft}></div>
        <div style={styles.circuitRight}></div>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes slideUp {
    from {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const styles = {
  container: {
    position: 'fixed',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    animation: 'slideUp 0.3s ease-out',
    pointerEvents: 'none'
  },
  toastWrapper: {
    position: 'relative',
    pointerEvents: 'auto'
  },
  glow: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '8px',
    filter: 'blur(12px)',
    opacity: 0.6,
    animation: 'pulse 2s infinite'
  },
  content: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    minWidth: '280px',
    maxWidth: '350px'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexShrink: 0
  },
  icon: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  message: {
    flex: 1,
    lineHeight: '1.4',
    fontWeight: '500'
  },
  circuitLeft: {
    position: 'absolute',
    left: '-20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '1px',
    background: 'linear-gradient(to left, rgba(255, 255, 255, 0.3), transparent)',
    pointerEvents: 'none'
  },
  circuitRight: {
    position: 'absolute',
    right: '-20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '1px',
    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.3), transparent)',
    pointerEvents: 'none'
  }
};
