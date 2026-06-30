import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, Users, ShoppingBag, Folder, Settings, ShieldAlert, X } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const AdminDashboard = () => {
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    deleteCategory,
  } = useContext(ProductContext);

  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Modal / Form States for Product CRUD
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodCountInStock, setProdCountInStock] = useState(0);
  const [prodError, setProdError] = useState('');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catError, setCatError] = useState('');

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data);
      setOrdersLoading(false);
    } catch (error) {
      setOrdersLoading(false);
      console.error(error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data } = await API.get('/users');
      setUsers(data);
      setUsersLoading(false);
    } catch (error) {
      setUsersLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Set default category on categories load
  useEffect(() => {
    if (categories.length > 0 && !prodCategory) {
      setProdCategory(categories[0]._id);
    }
  }, [categories]);

  // Submit Product Create or Edit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProdError('');

    if (!prodName || !prodPrice || !prodDescription || !prodImage || !prodCategory) {
      setProdError('Please provide all parameters');
      return;
    }

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      description: prodDescription,
      image: prodImage,
      category: prodCategory,
      countInStock: Number(prodCountInStock),
    };

    let res;
    if (editingProductId) {
      res = await updateProduct(editingProductId, payload);
    } else {
      res = await createProduct(payload);
    }

    if (res.success) {
      resetProductForm();
      setShowProductModal(false);
    } else {
      setProdError(res.message);
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice(0);
    setProdDescription('');
    setProdImage('');
    if (categories.length > 0) setProdCategory(categories[0]._id);
    setProdCountInStock(0);
    setProdError('');
  };

  const handleEditClick = (prod) => {
    setEditingProductId(prod._id);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdDescription(prod.description);
    setProdImage(prod.image);
    setProdCategory(prod.category?._id || prod.category);
    setProdCountInStock(prod.countInStock);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Confirm delete of this hardware item?')) {
      const res = await deleteProduct(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  // Submit Category Create
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCatError('');

    if (!catName || !catDescription) {
      setCatError('Please fill out all category details');
      return;
    }

    const res = await createCategory({ name: catName, description: catDescription });
    if (res.success) {
      setCatName('');
      setCatDescription('');
    } else {
      setCatError(res.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category? Ensure no products are mapped to it.')) {
      const res = await deleteCategory(id);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Confirm deletion of this user profile?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', minHeight: '85vh' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <ShieldAlert size={36} className="neon-text-purple" />
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Galactic Administrative Portal</span>
          <h1 className="neon-text-purple" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            ADMIN CONSOLE // NEBULA
          </h1>
        </div>
      </div>

      {/* Admin tabs switcher */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          gap: '10px',
          padding: '10px',
          borderRadius: '12px',
          marginBottom: '30px',
          flexWrap: 'wrap',
          background: 'rgba(10, 8, 26, 0.6)',
        }}
      >
        <button
          onClick={() => setActiveTab('products')}
          className={`cyber-btn ${activeTab === 'products' ? '' : 'cyber-btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
        >
          <ShoppingBag size={16} /> Manage Products
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`cyber-btn ${activeTab === 'categories' ? '' : 'cyber-btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
        >
          <Folder size={16} /> Product Categories
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`cyber-btn ${activeTab === 'orders' ? '' : 'cyber-btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
        >
          <Settings size={16} /> Manage Orders
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`cyber-btn ${activeTab === 'users' ? '' : 'cyber-btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
        >
          <Users size={16} /> User Profiles
        </button>
      </div>

      {/* Tabs Content */}
      <div style={{ minHeight: '400px' }}>
        
        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>PRODUCT SYSTEM ARCHIVES</h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setShowProductModal(true);
                }}
                className="cyber-btn"
                style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '6px' }}
              >
                <Plus size={16} /> Add New Augment
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Asset</th>
                    <th style={{ padding: '12px 8px' }}>Designation</th>
                    <th style={{ padding: '12px 8px' }}>Category</th>
                    <th style={{ padding: '12px 8px' }}>Unit Value</th>
                    <th style={{ padding: '12px 8px' }}>Storage</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                      </td>
                      <td style={{ padding: '12px 8px', color: '#fff', fontWeight: '500' }}>{prod.name}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className="cyber-badge cyber-badge-purple">
                          {prod.category?.name || 'Cybernetics'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--primary-glow)', fontWeight: 'bold' }}>${prod.price.toLocaleString()}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {prod.countInStock > 0 ? (
                          <span style={{ color: 'var(--success)' }}>{prod.countInStock} units</span>
                        ) : (
                          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Depleted</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditClick(prod)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--primary-glow)', cursor: 'pointer', padding: '6px' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Create Category Form */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '20px' }}>NEW CATEGORY ARCHIVE</h3>
              
              {catError && (
                <div className="cyber-badge cyber-badge-danger" style={{ display: 'block', padding: '8px', marginBottom: '15px', textAlign: 'center' }}>
                  {catError}
                </div>
              )}

              <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name:</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="cyber-input"
                    placeholder="e.g. Laser Tech"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Telemetry Spec (Description):</label>
                  <textarea
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    className="cyber-input"
                    rows={4}
                    placeholder="Describe category..."
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
                <button type="submit" className="cyber-btn" style={{ justifyContent: 'center' }}>
                  Initialize Category
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '20px' }}>ESTABLISHED CATEGORIES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="glass-panel"
                    style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}
                  >
                    <div>
                      <strong style={{ color: 'var(--primary-glow)', fontSize: '0.95rem' }}>{cat.name}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{cat.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px' }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '25px' }}>LOGISTICAL ROUTE TRANSACTIONS</h2>
            
            {ordersLoading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <div className="cyber-loader"></div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No orders placed on network database.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 8px' }}>Log ID</th>
                      <th style={{ padding: '12px 8px' }}>Client</th>
                      <th style={{ padding: '12px 8px' }}>Timestamp</th>
                      <th style={{ padding: '12px 8px' }}>Total Debit</th>
                      <th style={{ padding: '12px 8px' }}>Ledger status</th>
                      <th style={{ padding: '12px 8px' }}>Logistics Route</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Telemetry link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>
                          #{ord._id.substring(12).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 8px', color: '#fff' }}>{ord.user?.username || 'Pilot'}</td>
                        <td style={{ padding: '12px 8px' }}>{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--primary-glow)', fontWeight: 'bold' }}>${ord.totalPrice.toLocaleString()}</td>
                        <td style={{ padding: '12px 8px' }}>
                          {ord.isPaid ? (
                            <span className="cyber-badge cyber-badge-success">PAID</span>
                          ) : (
                            <span className="cyber-badge cyber-badge-danger">UNPAID</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {ord.status === 'Delivered' ? (
                            <span className="cyber-badge cyber-badge-success">DELIVERED</span>
                          ) : ord.status === 'Shipped' ? (
                            <span className="cyber-badge cyber-badge-cyan">SHIPPED</span>
                          ) : ord.status === 'Cancelled' ? (
                            <span className="cyber-badge cyber-badge-danger">CANCELLED</span>
                          ) : (
                            <span className="cyber-badge cyber-badge-warning">{ord.status}</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <Link
                            to={`/order/${ord._id}`}
                            className="cyber-btn cyber-btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: '4px' }}
                          >
                            Access
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '25px' }}>GRID CALLSIGN IDENTITY DATABASE</h2>
            
            {usersLoading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <div className="cyber-loader"></div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 8px' }}>Client ID</th>
                      <th style={{ padding: '12px 8px' }}>Callsign</th>
                      <th style={{ padding: '12px 8px' }}>Mail node</th>
                      <th style={{ padding: '12px 8px' }}>Security Access</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Expunge Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px 8px', fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>{u._id}</td>
                        <td style={{ padding: '12px 8px', color: '#fff', fontWeight: '500' }}>{u.username}</td>
                        <td style={{ padding: '12px 8px' }}>{u.email}</td>
                        <td style={{ padding: '12px 8px' }}>
                          {u.isAdmin ? (
                            <span className="cyber-badge cyber-badge-cyan">ADMIN SYSTEM</span>
                          ) : (
                            <span className="cyber-badge cyber-badge-purple">CLIENT PILOT</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u.isAdmin}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: u.isAdmin ? 'var(--text-muted)' : 'var(--danger)',
                              cursor: u.isAdmin ? 'not-allowed' : 'pointer',
                              padding: '6px',
                              opacity: u.isAdmin ? 0.3 : 1,
                            }}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal (Glassmorphic) */}
      {showProductModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3,0,20,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '550px',
              padding: '30px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #09090b, #0d0a1f)',
              border: '1px solid var(--primary-glow)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                {editingProductId ? 'EDIT AUGMENT ARCHIVE' : 'INITIALIZE NEW AUGMENT'}
              </h3>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {prodError && (
              <div className="cyber-badge cyber-badge-danger" style={{ display: 'block', padding: '8px', marginBottom: '15px', textAlign: 'center' }}>
                {prodError}
              </div>
            )}

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name / Designation:</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="cyber-input"
                  placeholder="e.g. Kinetic Shield Ring"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unit Price ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="cyber-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Initial Stock:</label>
                  <input
                    type="number"
                    value={prodCountInStock}
                    onChange={(e) => setProdCountInStock(e.target.value)}
                    className="cyber-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category System:</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="cyber-input"
                  style={{ background: '#0a081a' }}
                  required
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Telemetry Image URL:</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="cyber-input"
                  placeholder="https://images.unsplash.com/photo..."
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Part Specifications (Description):</label>
                <textarea
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="cyber-input"
                  rows={3}
                  placeholder="Enter parts telemetry, specs, hazard logs..."
                  required
                  style={{ resize: 'none' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" className="cyber-btn" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  {editingProductId ? 'Apply Upgrade' : 'Authorize Release'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    resetProductForm();
                    setShowProductModal(false);
                  }}
                  className="cyber-btn cyber-btn-secondary"
                  style={{ flexGrow: 1, justifyContent: 'center' }}
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
