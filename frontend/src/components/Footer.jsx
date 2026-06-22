import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '30px 24px',
        marginTop: '60px',
        background: 'rgba(3, 0, 20, 0.9)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <span
          className="neon-text-cyan"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}
        >
          NEBULA SYSTEM // CORPS.
        </span>
        <p>Providing advanced neural augmentations and sub-atomic machinery since 2088.</p>
        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} NEBULA. Secured with biometric authentication.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
