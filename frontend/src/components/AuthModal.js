import React, { useState } from 'react';
import axios from 'axios';
import './AuthModal.css';

function AuthModal({ type, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'buyer',
    brand_name: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, formData);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <h2>{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <>
              <div className="user-type-selector">
                <label className={`user-type-option ${formData.user_type === 'buyer' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="buyer"
                    checked={formData.user_type === 'buyer'}
                    onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                  />
                  <div className="user-type-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.5 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>Buyer</h3>
                    <p>Shop and explore fashion</p>
                  </div>
                </label>
                
                <label className={`user-type-option ${formData.user_type === 'vendor' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="vendor"
                    checked={formData.user_type === 'vendor'}
                    onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                  />
                  <div className="user-type-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>Vendor</h3>
                    <p>Sell your fashion designs</p>
                  </div>
                </label>
              </div>
              
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                required
              />
              
              {formData.user_type === 'vendor' && (
                <>
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={formData.brand_name}
                    onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Brand Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </>
              )}
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button type="submit" className="auth-submit">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-switch">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => window.location.reload()}>
            {type === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
