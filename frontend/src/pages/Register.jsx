import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg('Please enter all parameters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passkeys do not match');
      return;
    }

    const res = await register(username, email, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(3,0,20,0.95), rgba(13,10,31,0.8))',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="neon-text-purple" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            CREATE IDENTITY
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register your profile to standard Galactic grids
          </p>
        </div>

        {errorMsg && (
          <div
            className="cyber-badge cyber-badge-danger"
            style={{
              display: 'block',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Callsign (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="cyber-input"
              placeholder="e.g. CyberShopper"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Electronic Mail (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="pilot@nebula.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Security Passkey
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Confirm Security Passkey
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="cyber-input"
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="cyber-btn"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px', justifyContent: 'center' }}
          >
            {loading ? 'Encrypting Identity...' : 'Initialize Profile'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Registered pilot? </span>
          <Link
            to="/login"
            style={{
              color: '#c084fc',
              fontWeight: '600',
              textShadow: '0 0 5px rgba(127, 0, 255, 0.3)',
            }}
          >
            Terminal Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
