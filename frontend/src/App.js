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

  const handleLogin = () => {
    setAuthType('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthType('register');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    console.log('Login user data:', userData);
    if (!userData || !userData.email) {
      console.error('Invalid user data received:', userData);
      return;
    }
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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedCulture, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderAdminPage = () => {
    switch (adminPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'designers':
        return <Designers />;
      case 'orders':
        return <Orders />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  // Show landing page if not logged in
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
        <Sidebar 
          currentPage={adminPage} 
          onNavigate={setAdminPage}
          onBackToStore={() => setViewMode('store')}
        />
        <main className="admin-main">
          {renderAdminPage()}
        </main>
      </div>
    );
  }

  // Show vendor dashboard for vendors
  if (user?.user_type === 'vendor') {
    return (
      <div className="app">
        <Header 
          onCartClick={() => setShowCart(true)}
          onAdminClick={() => setViewMode('admin')}
          onLearnClick={() => setStoreView('learn')}
          onLogout={handleLogout}
          user={user}
          cartCount={cartCount}
          currentView={storeView}
        />
        <main className="main-content">
          {storeView === 'learn' ? (
            <FashionLearning />
          ) : (
            <VendorDashboard user={user} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        onCartClick={() => setShowCart(true)}
        onAdminClick={() => setViewMode('admin')}
        onLearnClick={() => setStoreView('learn')}
        onLogout={handleLogout}
        user={user}
        cartCount={cartCount}
        currentView={storeView}
      />
      
      <main className="main-content">
        {storeView === 'learn' ? (
          <FashionLearning />
        ) : (
          <div className="container">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading fashion collection...</p>
            </div>
          ) : (
            <>
              <div className="hero-section">
                <h1>Fashion Collection</h1>
                <p>Discover the latest trends in fashion</p>
              </div>

              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
              />

              <div className="filters-section">
                <div className="category-filter">
                  <label className="filter-label">Category:</label>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="category-filter">
                  <label className="filter-label">Culture:</label>
                  {cultures.map(culture => (
                    <button
                      key={culture}
                      className={`category-btn ${selectedCulture === culture ? 'active' : ''}`}
                      onClick={() => setSelectedCulture(culture)}
                    >
                      {culture}
                    </button>
                  ))}
                </div>

                <div className="controls">
                  <PriceFilter 
                    priceRange={priceRange}
                    onChange={setPriceRange}
                  />
                  
                  <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>

              <div className="products-header">
                <h2>{selectedCategory === 'All' ? 'All Products' : selectedCategory}</h2>
                <p>{products.length} items available</p>
              </div>
              
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>

              {products.length === 0 && (
                <div className="empty-state">
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
            </>
          )}
        </div>
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
