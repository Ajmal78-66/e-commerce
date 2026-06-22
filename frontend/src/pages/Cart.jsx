import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, prices, updateCartQty, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate('/place-order');
    } else {
      navigate('/login?redirect=place-order');
    }
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      <h1 className="neon-text-cyan" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>
        SHOPPING CART // MOUNTED HARDWARE
      </h1>

      {cartItems.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px',
            textAlign: 'center',
            borderRadius: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <ShoppingBag size={48} style={{ marginBottom: '15px', color: 'var(--primary-glow)', opacity: 0.8 }} />
          <h3 style={{ marginBottom: '10px', color: '#fff' }}>Cart is Empty</h3>
          <p style={{ marginBottom: '20px' }}>You have not mounted any cybernetic augments to your cart yet.</p>
          <Link to="/" className="cyber-btn">
            Explore Hardware Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 2 }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                />

                {/* Name & Pricing */}
                <div style={{ flexGrow: 1, minWidth: '150px' }}>
                  <Link to={`/product/${item.product}`}>
                    <h3
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '4px',
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#fff')}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-glow)' }}>
                    ${item.price.toLocaleString()}
                  </span>
                </div>

                {/* Quantity Editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty:</span>
                  <select
                    value={item.qty}
                    onChange={(e) => updateCartQty(item.product, Number(e.target.value))}
                    className="cyber-input"
                    style={{ width: '70px', padding: '6px', background: '#0a081a', cursor: 'pointer' }}
                  >
                    {[...Array(item.countInStock).keys()].slice(0, 10).map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Pricing Order Summary */}
          <div className="glass-panel" style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(3,0,20,0.95), rgba(13,10,31,0.9))', flexGrow: 1 }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>
              ORDER TELEMETRY
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal ({totalQty}):</span>
                <span>${prices.itemsPrice.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Galactic Shipping:</span>
                <span>
                  {prices.shippingPrice === 0 ? (
                    <strong style={{ color: 'var(--success)' }}>FREE</strong>
                  ) : (
                    `$${prices.shippingPrice.toLocaleString()}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tariff Tax (8%):</span>
                <span>${prices.taxPrice.toLocaleString()}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ color: '#fff' }}>TOTAL COST:</span>
                <span style={{ color: 'var(--primary-glow)', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}>
                  ${prices.totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="cyber-btn"
                style={{ width: '100%', padding: '12px', marginTop: '10px', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
