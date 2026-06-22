import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Shield, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ProductContext } from '../context/ProductContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { setSearchKeyword } = useContext(ProductContext);
  
  const [searchInput, setSearchInput] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/login');
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav
      className="glass-panel"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: '0 0 12px 12px',
        borderTop: 'none',
        padding: '12px 24px',
        margin: '0 auto 20px auto',
        maxWidth: '1400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3, 0, 20, 0.85)',
      }}
    >
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <span
          className="neon-text-cyan"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '900',
            fontSize: '1.5rem',
            letterSpacing: '3px',
          }}
        >
          NEBULA
        </span>
      </Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '4px 12px',
          width: '35%',
          minWidth: '220px',
          transition: 'border-color 0.3s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-glow)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            width: '100%',
            outline: 'none',
            padding: '6px 8px',
          }}
        />
        <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-glow)' }}>
          <Search size={18} />
        </button>
      </form>

      {/* Desktop Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-menu">
        {/* Wishlist */}
        <Link
          to="/wishlist"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
        >
          <Heart size={20} />
          {wishlistItems.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--accent-pink)',
                color: '#fff',
                fontSize: '0.7rem',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 0 5px var(--accent-pink)',
              }}
            >
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
        >
          <ShoppingCart size={20} />
          {totalCartQty > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--primary-glow)',
                color: '#000',
                fontSize: '0.7rem',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 0 5px var(--primary-glow)',
              }}
            >
              {totalCartQty}
            </span>
          )}
        </Link>

        {/* Profile / Actions */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="cyber-btn"
              style={{
                padding: '6px 16px',
                fontSize: '0.85rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <User size={14} /> {user.username}
            </button>

            {userDropdown && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '200px',
                  background: '#0a081a',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 200,
                }}
              >
                <Link
                  to="/profile"
                  onClick={() => setUserDropdown(false)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={16} /> My Profile
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserDropdown(false)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      color: '#a78bfa',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(167,139,250,0.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Shield size={16} /> Admin Console
                  </Link>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    color: 'var(--danger)',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="cyber-btn" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
        className="mobile-toggle"
      >
        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: '12px',
            right: '12px',
            background: 'rgba(3, 0, 20, 0.95)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 100,
          }}
        >
          <Link to="/cart" onClick={() => setMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} /> Cart ({totalCartQty})
          </Link>
          <Link to="/wishlist" onClick={() => setMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} /> Wishlist ({wishlistItems.length})
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Profile
              </Link>
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa' }}>
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenu(false)} className="cyber-btn" style={{ textAlign: 'center' }}>
              Login
            </Link>
          )}
        </div>
      )}

      {/* Basic responsive layout styling */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
