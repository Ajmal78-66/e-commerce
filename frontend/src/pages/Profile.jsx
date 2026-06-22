import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldAlert, Award, Calendar, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
        setOrdersLoading(false);
      } catch (error) {
        setOrdersLoading(false);
        console.error('Failed to load orders history:', error.message);
      }
    };
    fetchMyOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    try {
      setFormLoading(true);
      const payload = { username, email };
      if (password) payload.password = password;

      const res = await updateProfile(payload);
      setFormLoading(false);
      if (res.success) {
        setUpdateSuccess('Biometric profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setUpdateError(res.message);
      }
    } catch (error) {
      setFormLoading(false);
      setUpdateError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      <h1 className="neon-text-cyan" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>
        COMMAND CENTER // USER CONSOLE
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Update Credentials Form */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <User size={24} className="neon-text-cyan" />
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>
              CREDENTIAL LEDGER
            </h2>
          </div>

          {updateError && (
            <div className="cyber-badge cyber-badge-danger" style={{ display: 'block', padding: '8px', marginBottom: '15px', textAlign: 'center' }}>
              {updateError}
            </div>
          )}
          {updateSuccess && (
            <div className="cyber-badge cyber-badge-success" style={{ display: 'block', padding: '8px', marginBottom: '15px', textAlign: 'center' }}>
              {updateSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Callsign Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Primary Mail Node
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                New Security Passkey (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input"
                placeholder="Leave blank to keep current"
              />
            </div>

            {password && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Confirm Passkey
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="cyber-input"
                  placeholder="Re-enter passkey string"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="cyber-btn"
              style={{ width: '100%', padding: '10px', marginTop: '10px', justifyContent: 'center' }}
            >
              {formLoading ? 'Re-encrypting credentials...' : 'Commit Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Order History Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 2 }}>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
              <Award size={24} style={{ color: '#a78bfa' }} />
              <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>
                MISSION DEBIT LOG (ORDER HISTORY)
              </h2>
            </div>

            {ordersLoading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <div className="cyber-loader" style={{ width: '35px', height: '35px' }}></div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No past transactions recorded on Galactic databases.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="glass-panel"
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', display: 'block', marginBottom: '2px' }}>
                        ID: #{ord._id.substring(12).toUpperCase()}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-glow)', display: 'block' }}>
                        ${ord.totalPrice.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={12} /> {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Status Badges */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                        {ord.isPaid ? (
                          <span className="cyber-badge cyber-badge-success" style={{ fontSize: '0.65rem' }}>PAID</span>
                        ) : (
                          <span className="cyber-badge cyber-badge-danger" style={{ fontSize: '0.65rem' }}>UNPAID</span>
                        )}
                        {ord.isDelivered ? (
                          <span className="cyber-badge cyber-badge-success" style={{ fontSize: '0.65rem' }}>DISPATCHED</span>
                        ) : (
                          <span className="cyber-badge cyber-badge-warning" style={{ fontSize: '0.65rem' }}>PENDING</span>
                        )}
                      </div>

                      <Link to={`/order/${ord._id}`} className="cyber-btn cyber-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '4px' }}>
                        <ExternalLink size={12} /> Details
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
