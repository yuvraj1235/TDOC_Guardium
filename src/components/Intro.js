import React from "react";

export default function Intro({ onComplete }) {
  const slide = {
    title: "Guardium",
    subtitle: "Manage Your Passwords",
    description: "All in one place",
    icon: "🛡️",
    color: "#10b981"
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <div style={styles.bgEffects}>
        <div style={{
          ...styles.colorBlur,
          backgroundColor: slide.color,
          opacity: 0.15
        }}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.slideContainer}>
          <div style={styles.iconContainer}>
            <div style={{
              ...styles.iconCircle,
              borderColor: slide.color
            }}>
              <span style={styles.icon}>{slide.icon}</span>
            </div>
          </div>

          <h1 style={styles.title}>{slide.title}</h1>
          <h2 style={styles.subtitle}>{slide.subtitle}</h2>
          <p style={styles.description}>{slide.description}</p>
        </div>

        <div style={styles.footer}>
          <button
            onClick={onComplete}
            style={{
              ...styles.nextButton,
              backgroundColor: slide.color
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

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
    width: '100%',
    height: '100%',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: '"Ubuntu", "Segoe UI", Roboto, sans-serif'
  },
  bgEffects: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none'
  },
  colorBlur: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'pulse 4s infinite ease-in-out',
    transition: 'background-color 0.6s ease'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '400px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  skipButton: {
    alignSelf: 'flex-end',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 16px',
    fontWeight: '500'
  },
  slideContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
    animation: 'slideIn 0.5s ease-out',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: '60px'
  },
  iconContainer: {
    marginBottom: '24px'
  },
  iconCircle: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    animation: 'float 3s infinite ease-in-out',
    transition: 'border-color 0.6s ease'
  },
  icon: {
    fontSize: '56px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    color: '#e2e8f0',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
    color: '#94a3b8',
    letterSpacing: '-0.01em'
  },
  description: {
    fontSize: '15px',
    color: '#64748b',
    margin: '8px 0 0 0',
    maxWidth: '280px',
    lineHeight: '1.6'
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    paddingBottom: '16px'
  },
  pagination: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  dot: {
    height: '8px',
    borderRadius: '10px',
    transition: 'all 0.3s ease'
  },
  nextButton: {
    width: '100%',
    maxWidth: '280px',
    padding: '14px',
    borderRadius: '16px',
    border: 'none',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  }
};