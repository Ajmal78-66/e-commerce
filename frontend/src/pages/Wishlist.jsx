import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="cyber-loader"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      <h1 className="neon-text-purple" style={{ fontSize: '1.8rem', marginBottom: '30px' }}>
        SAVED DISCOVERIES // WISHLIST
      </h1>

      {wishlistItems.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px',
            textAlign: 'center',
            borderRadius: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <Heart size={48} style={{ marginBottom: '15px', color: 'var(--accent-pink)', opacity: 0.8 }} />
          <h3 style={{ marginBottom: '10px', color: '#fff' }}>Wishlist is Empty</h3>
          <p style={{ marginBottom: '20px' }}>You have not stored any blueprint augmentations in your database.</p>
          <Link to="/" className="cyber-btn cyber-btn-secondary">
            Explore Hardware Catalog
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
          }}
        >
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', paddingTop: '70%' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '10px' }}>
                <span className="cyber-badge cyber-badge-purple" style={{ alignSelf: 'flex-start' }}>
                  {product.category?.name || 'Cybernetics'}
                </span>
                
                <Link to={`/product/${product._id}`}>
                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#fff',
                      transition: 'color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#fff')}
                  >
                    {product.name}
                  </h3>
                </Link>

                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-glow)' }}>
                  ${product.price.toLocaleString()}
                </span>

                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.countInStock === 0}
                    className="cyber-btn"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '4px' }}
                  >
                    <ShoppingCart size={14} /> Add
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
