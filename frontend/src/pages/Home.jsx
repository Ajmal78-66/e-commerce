import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const {
    products,
    categories,
    loading,
    activeCategory,
    setActiveCategory,
    sortMode,
    setSortMode,
    searchKeyword,
    setSearchKeyword,
  } = useContext(ProductContext);

  const handleCategoryClick = (id) => {
    setActiveCategory(activeCategory === id ? '' : id);
  };

  const handleResetSearch = () => {
    setSearchKeyword('');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', minHeight: '80vh' }}>
      
      {/* Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '50px 30px',
          textAlign: 'center',
          borderRadius: '16px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(3, 0, 20, 0.95), rgba(22, 17, 51, 0.6))',
          border: '1px solid rgba(0, 242, 254, 0.15)',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1
            className="floating-item"
            style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              marginBottom: '15px',
              color: '#fff',
              textShadow: '0 0 15px rgba(0, 242, 254, 0.6)',
              fontFamily: 'var(--font-display)',
            }}
          >
            AUGMENT YOUR REALITY
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Acquire next-generation cybernetic implants, sub-atomic processors, and high-performance gravity propulsion engines.
          </p>
        </div>
        {/* Background glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(var(--secondary-glow), transparent 60%)',
            opacity: 0.3,
            filter: 'blur(30px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        ></div>
      </div>

      {/* Search status / Filters bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Category Chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setActiveCategory('')}
            className={`cyber-btn ${!activeCategory ? '' : 'cyber-btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
          >
            All Tech
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className={`cyber-btn ${activeCategory === cat._id ? '' : 'cyber-btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sort By:</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="cyber-input"
            style={{
              width: '180px',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              background: '#0a081a',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            <option value="">Latest Arrival</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Active Search Filter display */}
      {searchKeyword && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Showing results for search keyword: "<strong>{searchKeyword}</strong>"</span>
          <button
            onClick={handleResetSearch}
            className="cyber-btn cyber-btn-danger"
            style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
          >
            Reset
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="cyber-loader"></div>
          <p style={{ marginTop: '10px', color: 'var(--primary-glow)', fontFamily: 'var(--font-display)' }}>
            ACCESSING DATABANKS...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px',
            textAlign: 'center',
            borderRadius: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#fff' }}>No Items Found</h3>
          <p>We could not find any cybernetic parts matching your filter configuration.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
          }}
        >
          {products.map((prod) => (
            <div key={prod._id}>
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
