import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FashionLearning.css';

function FashionLearning() {
  const [activeTab, setActiveTab] = useState('guides');
  const [guides, setGuides] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'guides') {
        const response = await axios.get('/api/fashion/guides');
        setGuides(response.data);
      } else {
        const response = await axios.get('/api/fashion/outfits');
        setOutfits(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (type, id) => {
    const ALLOWED_TYPES = ['guides', 'outfits'];
    if (!ALLOWED_TYPES.includes(type) || !/^\d+$/.test(String(id))) {
      console.error('Invalid type or id');
      return;
    }
    try {
      await axios.post(`/api/fashion/${type}/${id}/like`);
      fetchContent();
    } catch (err) {
      console.error(err);
    }
  };

  const viewGuide = async (id) => {
    try {
      const response = await axios.get(`/api/fashion/guides/${id}`);
      setSelectedGuide(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const viewOutfit = async (id) => {
    try {
      const response = await axios.get(`/api/fashion/outfits/${id}`);
      setSelectedOutfit(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (selectedGuide) {
    return (
      <div className="fashion-learning">
        <button className="back-btn" onClick={() => setSelectedGuide(null)}>
          ← Back to Guides
        </button>
        <div className="guide-detail">
          <img src={selectedGuide.image_url} alt={selectedGuide.title} />
          <div className="guide-content">
            <span className="guide-category">{selectedGuide.category}</span>
            <h1>{selectedGuide.title}</h1>
            <div className="guide-meta">
              <span>By {selectedGuide.first_name} {selectedGuide.last_name}</span>
              <span>{selectedGuide.views} views</span>
              <span>{selectedGuide.likes} likes</span>
            </div>
            <p className="guide-text">{selectedGuide.content}</p>
            <div className="guide-tags">
              {selectedGuide.tags?.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            <button className="like-btn" onClick={() => handleLike('guides', selectedGuide.id)}>
              ❤️ Like
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOutfit) {
    return (
      <div className="fashion-learning">
        <button className="back-btn" onClick={() => setSelectedOutfit(null)}>
          ← Back to Outfits
        </button>
        <div className="outfit-detail">
          <img src={selectedOutfit.image_url} alt={selectedOutfit.title} />
          <div className="outfit-content">
            <h1>{selectedOutfit.title}</h1>
            <p className="outfit-description">{selectedOutfit.description}</p>
            <div className="outfit-meta">
              <span className="badge">{selectedOutfit.occasion}</span>
              <span className="badge">{selectedOutfit.season}</span>
              <span className="badge">{selectedOutfit.style_type}</span>
            </div>
            <button className="like-btn" onClick={() => handleLike('outfits', selectedOutfit.id)}>
              ❤️ {selectedOutfit.likes} Likes
            </button>
            
            {selectedOutfit.products && selectedOutfit.products.length > 0 && (
              <div className="outfit-products">
                <h3>Shop This Look</h3>
                <div className="products-grid">
                  {selectedOutfit.products.map(product => (
                    <div key={product.id} className="product-mini">
                      <img src={product.image_url} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>${product.price}</p>
                      <span className="designer">{product.brand_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fashion-learning">
      <div className="learning-header">
        <h1>Fashion Learning Hub</h1>
        <p>Elevate your style with expert tips, trends, and outfit inspiration</p>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'guides' ? 'active' : ''} 
          onClick={() => setActiveTab('guides')}
        >
          Style Guides
        </button>
        <button 
          className={activeTab === 'outfits' ? 'active' : ''} 
          onClick={() => setActiveTab('outfits')}
        >
          Outfit Ideas
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="content-grid">
          {activeTab === 'guides' ? (
            guides.map(guide => (
              <div key={guide.id} className="guide-card" onClick={() => viewGuide(guide.id)}>
                <img src={guide.image_url} alt={guide.title} />
                <div className="card-content">
                  <span className="category">{guide.category}</span>
                  <h3>{guide.title}</h3>
                  <div className="card-meta">
                    <span>👁️ {guide.views}</span>
                    <span>❤️ {guide.likes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            outfits.map(outfit => (
              <div key={outfit.id} className="outfit-card" onClick={() => viewOutfit(outfit.id)}>
                <img src={outfit.image_url} alt={outfit.title} />
                <div className="card-content">
                  <h3>{outfit.title}</h3>
                  <p>{outfit.description}</p>
                  <div className="outfit-badges">
                    <span>{outfit.occasion}</span>
                    <span>{outfit.style_type}</span>
                  </div>
                  <div className="card-meta">
                    <span>❤️ {outfit.likes}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default FashionLearning;
