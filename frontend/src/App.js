import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import ProductCard from './components/ProductCard';
import Header from './components/Header';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import PriceFilter from './components/PriceFilter';
import FashionLearning from './components/FashionLearning';
import VendorDashboard from './components/VendorDashboard';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Designers from './pages/Designers';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import TrendBanner from './components/TrendBanner';
import CollectionSpotlight from './components/CollectionSpotlight';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img shimmer" />
    <div className="skeleton-body">
      <div className="skeleton-line short shimmer" />
      <div className="skeleton-line shimmer" />
      <div className="skeleton-line medium shimmer" />
      <div className="skeleton-line short shimmer" />
    </div>
    <div className="skeleton-btn shimmer" />
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [viewMode, setViewMode] = useState('store');
  const [storeView, setStoreView] = useState('shop');
  const [adminPage, setAdminPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCulture, setSelectedCulture] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());

  const handleLogin = () => { setAuthType('login'); setShowAuthModal(true); };
  const handleRegister = () => { setAuthType('register'); setShowAuthModal(true); };

  const handleAuthSuccess = (userData) => {
    if (!userData || !userData.email) return;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setViewMode('store');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear'];
  const cultures = ['All', 'African', 'Western', 'Asian', 'Middle Eastern', 'Latin American', 'Fusion'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedCulture !== 'All') params.append('cultureCategory', selectedCulture);
      if (searchQuery) params.append('search', searchQuery);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (sortBy) params.append('sortBy', sortBy);
      const response = await axios.get(`/api/search?${params}`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedCulture, searchQuery, priceRange, sortBy]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.id !== productId));

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number.parseFloat(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCollectionSelect = (culture) => {
    setSelectedCulture(culture);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderAdminPage = () => {
    switch (adminPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'designers': return <Designers />;
      case 'orders': return <Orders />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <>
        <LandingPage onLogin={handleLogin} onRegister={handleRegister} />
        {showAuthModal && (
          <AuthModal
            type={authType}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  }

  if (viewMode === 'admin') {
    return (
      <div className="admin-app">
        <Sidebar currentPage={adminPage} onNavigate={setAdminPage} onBackToStore={() => setViewMode('store')} />
        <main className="admin-main">{renderAdminPage()}</main>
      </div>
    );
  }

  if (user?.user_type === 'vendor') {
    return (
      <div className="app">
        <Header
          onCartClick={() => setShowCart(true)}
          onAdminClick={() => setViewMode('admin')}
          onLearnClick={() => setStoreView('learn')}
          onLogout={handleLogout}
          onWishlistClick={() => {}}
          user={user}
          cartCount={cartCount}
          wishlistCount={0}
          currentView={storeView}
        />
        <main className="main-content">
          {storeView === 'learn' ? <FashionLearning /> : <VendorDashboard user={user} />}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        onCartClick={() => setShowCart(true)}
        onAdminClick={() => setViewMode('admin')}
        onLearnClick={() => setStoreView(storeView === 'learn' ? 'shop' : 'learn')}
        onLogout={handleLogout}
        onWishlistClick={() => {}}
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlist.size}
        currentView={storeView}
      />

      <TrendBanner />

      <main className="main-content">
        {storeView === 'learn' ? (
          <FashionLearning />
        ) : (
          <>
            {/* Editorial hero */}
            <div className="shop-hero">
              <div className="shop-hero-inner">
                <p className="shop-hero-eyebrow">New Arrivals · Spring 2026</p>
                <h1 className="shop-hero-title">Fashion<br /><em>Collection</em></h1>
                <p className="shop-hero-sub">
                  Discover curated styles from {products.length > 0 ? products.length : '—'} pieces across cultures &amp; categories
                </p>
              </div>
            </div>

            {/* Collection grid */}
            <CollectionSpotlight onSelectCulture={handleCollectionSelect} />

            {/* Shop section */}
            <div id="products-section" className="container">
              {error && (
                <div className="error-banner">
                  {error}
                  <button onClick={() => setError(null)}>×</button>
                </div>
              )}

              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              <div className="filters-section">
                <div className="filter-group">
                  <span className="filter-label">Category</span>
                  <div className="filter-pills">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">Culture</span>
                  <div className="filter-pills">
                    {cultures.map(culture => (
                      <button
                        key={culture}
                        className={`pill-btn ${selectedCulture === culture ? 'active' : ''}`}
                        onClick={() => setSelectedCulture(culture)}
                      >
                        {culture}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-controls">
                  <PriceFilter priceRange={priceRange} onChange={setPriceRange} />
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="name">Name: A–Z</option>
                  </select>
                </div>
              </div>

              <div className="products-header">
                <div>
                  <h2>
                    {selectedCulture !== 'All' ? `${selectedCulture} ` : ''}
                    {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
                  </h2>
                  {!loading && <p>{products.length} item{products.length !== 1 ? 's' : ''}</p>}
                </div>
                {(selectedCategory !== 'All' || selectedCulture !== 'All' || searchQuery || priceRange.min || priceRange.max) && (
                  <button className="clear-filters-btn" onClick={() => {
                    setSearchQuery('');
                    setPriceRange({ min: '', max: '' });
                    setSelectedCategory('All');
                    setSelectedCulture('All');
                  }}>
                    Clear filters ×
                  </button>
                )}
              </div>

              {loading ? (
                <div className="products-grid">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : products.length > 0 ? (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      isWishlisted={wishlist.has(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query</p>
                  <button className="btn-primary" onClick={() => {
                    setSearchQuery('');
                    setPriceRange({ min: '', max: '' });
                    setSelectedCategory('All');
                    setSelectedCulture('All');
                  }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {showCart && (
        <Cart
          items={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          total={cartTotal}
        />
      )}
    </div>
  );
}

export default App;
