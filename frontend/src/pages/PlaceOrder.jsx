import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const PlaceOrder = () => {
  const { cartItems, prices, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!address || !city || !postalCode || !country) {
      setErrorMsg('Please provide complete shipping telemetry');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        orderItems: cartItems.map((x) => ({
          product: x.product,
          name: x.name,
          image: x.image,
          price: x.price,
          qty: x.qty,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
      };

      const { data } = await API.post('/orders', orderPayload);
      
      // Clear Cart state & localStorage
      clearCart();
      setLoading(false);
      
      // Redirect to Order Detail status page
      navigate(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to submit order');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      <h1 className="neon-text-cyan" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>
        ESTABLISH ORDER ROUTE // CHECKOUT
      </h1>

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

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Shipping & Payment Info */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
            SHIPPING ROUTE COORDINATES
          </h2>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sector Address:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="cyber-input"
              placeholder="e.g. 505 Matrix Arcade, Sector 7"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Dome / City:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="cyber-input"
                placeholder="Neo-Tokyo"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Grid Postal Code:
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="cyber-input"
                placeholder="10042"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Galaxy / Country:
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="cyber-input"
              placeholder="Earth Sector"
              required
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>
            PAYMENT NETWORK PROTOCOL
          </h2>

          <div style={{ display: 'flex', gap: '15px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: paymentMethod === 'Credit Card' ? 'var(--primary-glow)' : 'var(--text-main)',
              }}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Credit Card'}
                onChange={() => setPaymentMethod('Credit Card')}
                style={{ accentColor: 'var(--primary-glow)' }}
              />
              Credit Card / Chips
            </label>
            
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: paymentMethod === 'Quantum Token' ? 'var(--primary-glow)' : 'var(--text-main)',
              }}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'Quantum Token'}
                onChange={() => setPaymentMethod('Quantum Token')}
                style={{ accentColor: 'var(--primary-glow)' }}
              />
              Quantum Credits
            </label>
          </div>
        </div>

        {/* Right Column: Order Items Review & Submission */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Items Review */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '15px' }}>
              HARDWARE LOADOUT
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: 'flex', justifyItems: 'center', gap: '15px', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {item.name} <strong>x{item.qty}</strong>
                  </span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="glass-panel" style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(3,0,20,0.95), rgba(13,10,31,0.9))' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>
              TRANSACTION COST LOG
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Cost:</span>
                <span>${prices.itemsPrice.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gravitational Transport:</span>
                <span>
                  {prices.shippingPrice === 0 ? (
                    <strong style={{ color: 'var(--success)' }}>FREE</strong>
                  ) : (
                    `$${prices.shippingPrice.toLocaleString()}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tariff Tax:</span>
                <span>${prices.taxPrice.toLocaleString()}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span style={{ color: '#fff' }}>TOTAL DEBIT:</span>
                <span style={{ color: 'var(--primary-glow)', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}>
                  ${prices.totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn"
                style={{ width: '100%', padding: '12px', marginTop: '15px', justifyContent: 'center' }}
              >
                {loading ? 'Transmitting Data...' : 'Confirm order route'}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default PlaceOrder;
