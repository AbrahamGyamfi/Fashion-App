import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VendorDashboard.css';

function VendorDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [designer, setDesigner] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Tops',
    culture_category: 'Western',
    size: '',
    color: '',
    image_url: ''
  });

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const designerRes = await axios.get(`/api/designers`);
      const myDesigner = designerRes.data.find(d => d.email === user.email);
      setDesigner(myDesigner);

      if (myDesigner) {
        const productsRes = await axios.get(`/api/designers/${myDesigner.id}/products`);
        setProducts(productsRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', {
        ...formData,
        designer_id: designer.id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Tops',
        culture_category: 'Western',
        size: '',
        color: '',
        image_url: ''
      });
      fetchVendorData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!designer) {
    return (
      <div className="vendor-dashboard">
        <div className="no-designer">
          <h2>Vendor Profile Not Found</h2>
          <p>Please contact support to set up your vendor account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      <div className="vendor-header">
        <div className="vendor-info">
          <h1>{designer.brand_name}</h1>
          <p>{designer.description}</p>
          <div className="vendor-stats">
            <div className="stat">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-value">{designer.rating || 0}</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat">
              <span className="stat-value">{designer.review_count || 0}</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </div>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Add Product
        </button>
      </div>

      <div className="products-section">
        <h2>My Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-item">
              <img src={product.image_url} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="stock">Stock: {product.stock}</p>
                <span className={`status ${product.status}`}>{product.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Footwear">Footwear</option>
              </select>
              <select
                value={formData.culture_category}
                onChange={(e) => setFormData({...formData, culture_category: e.target.value})}
              >
                <option value="African">African Fashion</option>
                <option value="Western">Western Fashion</option>
                <option value="Asian">Asian Fashion</option>
                <option value="Middle Eastern">Middle Eastern Fashion</option>
                <option value="Latin American">Latin American Fashion</option>
                <option value="Fusion">Fusion & Contemporary</option>
              </select>
              <input
                type="text"
                placeholder="Size (e.g., S, M, L)"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
              />
              <input
                type="text"
                placeholder="Color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;
