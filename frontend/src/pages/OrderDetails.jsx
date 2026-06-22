import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, Truck, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [payLoading, setPayLoading] = useState(false);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  
  const [adminStatus, setAdminStatus] = useState('');

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
      setAdminStatus(data.status);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to load order details');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handlePayOrder = async () => {
    try {
      setPayLoading(true);
      const { data } = await API.put(`/orders/${id}/pay`, {});
      setOrder(data);
      setPayLoading(false);
    } catch (error) {
      setPayLoading(false);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDeliverOrder = async () => {
    try {
      setDeliverLoading(true);
      const { data } = await API.put(`/orders/${id}/deliver`, {});
      setOrder(data);
      setAdminStatus('Delivered');
      setDeliverLoading(false);
    } catch (error) {
      setDeliverLoading(false);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      const { data } = await API.put(`/orders/${id}/status`, { status: newStatus });
      setOrder(data);
      setAdminStatus(newStatus);
      setStatusLoading(false);
    } catch (error) {
      setStatusLoading(false);
      alert(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="cyber-loader"></div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 className="cyber-badge cyber-badge-danger" style={{ display: 'inline-block', padding: '16px', fontSize: '1rem' }}>
          {errorMsg || 'Order not found'}
        </h2>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="cyber-btn">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TRANSACTION HASH:</span>
          <h1 className="neon-text-cyan" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
            ORDER #{order._id}
          </h1>
        </div>

        <div>
          {order.status === 'Delivered' ? (
            <span className="cyber-badge cyber-badge-success">TRANSACTION ACCOMPLISHED</span>
          ) : order.status === 'Cancelled' ? (
            <span className="cyber-badge cyber-badge-danger">TRANSACTION VOIDED</span>
          ) : (
            <span className="cyber-badge cyber-badge-warning">TRANSACTION IN TRANSIT</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Client Details, Logistical Details, Order Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: 2 }}>
          
          {/* Client Details */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '15px' }}>
              CLIENT TELEMETRY
            </h2>
            <p style={{ marginBottom: '8px' }}>
              <strong>Callsign:</strong> {order.user?.username}
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              <strong>Communications Node (Email):</strong> {order.user?.email}
            </p>
          </div>

          {/* Logistical Details */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} /> LOGISTICAL COORDINATES
            </h2>
            
            <p style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>
              <strong>Address Node:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            
            {order.isDelivered ? (
              <div className="cyber-badge cyber-badge-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                <CheckCircle size={16} /> Dispatched & delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="cyber-badge cyber-badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                <Clock size={16} /> Logistical cargo pending dispatch
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} /> NETWORK PAYMENT GATE
            </h2>
            
            <p style={{ marginBottom: '15px' }}>
              <strong>Payment Protocol:</strong> {order.paymentMethod}
            </p>
            
            {order.isPaid ? (
              <div className="cyber-badge cyber-badge-success" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> Verified on network ledger on {new Date(order.paidAt).toLocaleString()}
                </div>
                {order.paymentResult && (
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    <strong>Ledger ID:</strong> {order.paymentResult.id}
                  </span>
                )}
              </div>
            ) : (
              <div className="cyber-badge cyber-badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                <ShieldAlert size={16} /> Ledger payment unverified (Payment required)
              </div>
            )}
          </div>

          {/* Order Items Review */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '20px' }}>
              CARGO INVENTORY LOADOUT
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                    <div>
                      <Link to={`/product/${item.product}`}>
                        <h4
                          style={{
                            fontSize: '0.9rem',
                            color: '#fff',
                            fontWeight: '600',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#fff')}
                        >
                          {item.name}
                        </h4>
                      </Link>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Qty: {item.qty} @ ${item.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Ledger Summary, Admin Updates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', flexGrow: 1 }}>
          
          {/* Cost Summary & Pay Button */}
          <div className="glass-panel" style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(3,0,20,0.95), rgba(13,10,31,0.9))' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>
              TRANSACTION DEBITS
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span>${order.itemsPrice.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Galactic Transport:</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <strong style={{ color: 'var(--success)' }}>FREE</strong>
                  ) : (
                    `$${order.shippingPrice.toLocaleString()}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tariff Tax:</span>
                <span>${order.taxPrice.toLocaleString()}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ color: '#fff' }}>TOTAL COST:</span>
                <span style={{ color: 'var(--primary-glow)', textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}>
                  ${order.totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Pay Now Button */}
              {!order.isPaid && (
                <button
                  onClick={handlePayOrder}
                  disabled={payLoading}
                  className="cyber-btn"
                  style={{ width: '100%', padding: '12px', marginTop: '20px', justifyContent: 'center' }}
                >
                  {payLoading ? 'Broadcasting Ledger Payment...' : 'Verify Ledger Payment'}
                </button>
              )}
            </div>
          </div>

          {/* Admin Control Panel */}
          {user && user.isAdmin && (
            <div
              className="glass-panel"
              style={{
                padding: '24px',
                border: '1px solid #c084fc',
                background: 'linear-gradient(135deg, rgba(10, 8, 26, 0.95), rgba(41, 16, 85, 0.2))',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', color: '#c084fc', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} /> ADMIN LOGISTICS CONSOLE
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Change Status */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Logistics Route Status:
                  </label>
                  <select
                    value={adminStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusLoading}
                    className="cyber-input"
                    style={{ background: '#0a081a' }}
                  >
                    <option value="Pending">Pending Verification</option>
                    <option value="Processing">In Processing Assembly</option>
                    <option value="Shipped">Dispatched / Shipped</option>
                    <option value="Delivered">Delivered & Closed</option>
                    <option value="Cancelled">Cancelled / Voided</option>
                  </select>
                </div>

                {/* Quick Deliver */}
                {order.isPaid && !order.isDelivered && (
                  <button
                    onClick={handleDeliverOrder}
                    disabled={deliverLoading}
                    className="cyber-btn cyber-btn-secondary"
                    style={{
                      width: '100%',
                      padding: '10px',
                      color: '#a78bfa',
                      borderColor: '#a78bfa',
                      justifyContent: 'center',
                    }}
                  >
                    {deliverLoading ? 'Configuring Dispatch...' : 'Instant Deliver Route'}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;
