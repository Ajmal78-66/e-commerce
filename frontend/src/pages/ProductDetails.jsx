import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Send } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import Rating from '../components/Rating';

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductDetails, createProductReview } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const loadProduct = async () => {
    setLoading(true);
    const res = await getProductDetails(id);
    if (res.success) {
      setProduct(res.product);
    } else {
      setErrorMsg(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!comment) {
      setReviewError('Please write a review comment');
      return;
    }

    const res = await createProductReview(id, { rating, comment });
    if (res.success) {
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      // Reload product details to see new review and updated average score
      loadProduct();
    } else {
      setReviewError(res.message);
    }
  };

  const isLiked = product ? isWishlisted(product._id) : false;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="cyber-loader"></div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        <h2 className="cyber-badge cyber-badge-danger" style={{ display: 'inline-block', padding: '16px', fontSize: '1rem' }}>
          {errorMsg || 'Product not found'}
        </h2>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="cyber-btn">
            <ArrowLeft size={16} /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      
      {/* Back link */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          marginBottom: '30px',
          fontWeight: '500',
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-glow)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <ArrowLeft size={16} /> BACK TO DISCOVERY
      </Link>

      {/* Main product card details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', marginBottom: '60px' }}>
        {/* Left Column: Image with Glowing borders */}
        <motion.div
          className="glass-panel"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            padding: '10px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '500px',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '480px',
              objectFit: 'cover',
              borderRadius: '12px',
            }}
          />
        </motion.div>

        {/* Right Column: Information Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span className="cyber-badge cyber-badge-cyan" style={{ marginBottom: '10px', display: 'inline-block' }}>
              {product.category?.name || 'Scientific'}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
              {product.name}
            </h1>
            <Rating value={product.rating} text={`${product.numReviews} buyer reviews`} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing & Stock */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
            <span
              style={{
                fontSize: '2.2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: '900',
                color: 'var(--primary-glow)',
                textShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
              }}
            >
              ${product.price.toLocaleString()}
            </span>

            <div>
              {product.countInStock > 0 ? (
                <span className="cyber-badge cyber-badge-success">
                  {product.countInStock} ITEMS IN STORAGE
                </span>
              ) : (
                <span className="cyber-badge cyber-badge-danger">DEPLETED STOCK</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Purchase Actions */}
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="cyber-input"
                  style={{ width: '80px', padding: '8px', cursor: 'pointer', background: '#0a081a' }}
                >
                  {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleAddToCart} className="cyber-btn" style={{ padding: '12px 28px' }}>
                <ShoppingCart size={18} /> Mount to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="cyber-btn cyber-btn-secondary"
                style={{ padding: '12px', borderRadius: '6px' }}
              >
                <Heart size={18} color={isLiked ? 'var(--accent-pink)' : '#fff'} fill={isLiked ? 'var(--accent-pink)' : 'none'} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Tab */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* Reviews List */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '25px', color: '#fff' }}>
            CLIENT FEEDBACK
          </h2>
          {product.reviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: '24px', color: 'var(--text-muted)' }}>
              No client feedback logged for this part yet. Be the first to verify this augment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {product.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="glass-panel"
                  style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{rev.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Rating value={rev.rating} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '25px', color: '#fff' }}>
            LOG PERFORMANCE REVIEW
          </h2>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviewError && (
                <div className="cyber-badge cyber-badge-danger" style={{ padding: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="cyber-badge cyber-badge-success" style={{ padding: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                  {reviewSuccess}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Rating Score:
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="cyber-input"
                  style={{ background: '#0a081a' }}
                >
                  <option value="5">5 - Optimal Augmentation</option>
                  <option value="4">4 - High Performance</option>
                  <option value="3">3 - Operational</option>
                  <option value="2">2 - Unstable Diagnostics</option>
                  <option value="1">1 - Total Hardware Failure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Telemetry Log (Comment):
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="cyber-input"
                  rows={4}
                  placeholder="Input telemetry comments regarding operational use..."
                  required
                  style={{ resize: 'none' }}
                ></textarea>
              </div>

              <button type="submit" className="cyber-btn" style={{ justifyContent: 'center' }}>
                <Send size={16} /> Broadcast Log
              </button>
            </form>
          ) : (
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '15px' }}>Authentication required to log performance telemetry.</p>
              <Link to="/login" className="cyber-btn cyber-btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Authorize Account
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
