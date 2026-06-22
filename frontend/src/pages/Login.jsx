import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  const redirect = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter all credentials');
      return;
    }

    const res = await login(email, password);
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
        minHeight: '75vh',
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
          <h2 className="neon-text-cyan" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            TERMINAL LOGIN
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your credentials to access your user console
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Biometric Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="user@nebula.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
              Passkey String
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

          <button
            type="submit"
            className="cyber-btn"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px', justifyContent: 'center' }}
          >
            {loading ? 'Decrypting Session...' : 'Establish Session'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>New pilot? </span>
          <Link
            to="/register"
            style={{
              color: 'var(--primary-glow)',
              fontWeight: '600',
              textShadow: '0 0 5px rgba(0, 242, 254, 0.3)',
            }}
          >
            Register Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
