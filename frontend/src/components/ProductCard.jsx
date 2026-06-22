import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import Rating from './Rating';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);

  const isLiked = isWishlisted(product._id);

  return (
    <motion.div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: '0 15px 35px rgba(0, 242, 254, 0.15)',
        borderColor: 'rgba(0, 242, 254, 0.4)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.3s ease',
        }}
      >
        <Heart
          size={18}
          color={isLiked ? 'var(--accent-pink)' : '#fff'}
          fill={isLiked ? 'var(--accent-pink)' : 'none'}
          style={{ filter: isLiked ? 'drop-shadow(0 0 5px var(--accent-pink))' : 'none' }}
        />
      </button>

      {/* Image Container with Glow Background */}
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative', paddingTop: '75%' }}>
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
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Details Area */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="cyber-badge cyber-badge-purple">
            {product.category?.name || 'Futuristic Tech'}
          </span>
          {product.countInStock === 0 && (
            <span className="cyber-badge cyber-badge-danger">OUT OF STOCK</span>
          )}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--text-main)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          >
            {product.name}
          </h3>
        </Link>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

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
          <span
            style={{
              fontSize: '1.2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 'bold',
              color: 'var(--primary-glow)',
              textShadow: '0 0 5px rgba(0, 242, 254, 0.4)',
            }}
          >
            ${product.price.toLocaleString()}
          </span>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className="cyber-btn"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: '4px',
            }}
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
