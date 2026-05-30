import React from 'react';
import './CollectionSpotlight.css';

const COLLECTIONS = [
  {
    id: 'african',
    label: 'African Heritage',
    subtitle: 'Bold prints · Kente · Ankara',
    culture: 'African',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    accent: '#e67e22',
  },
  {
    id: 'western',
    label: 'Western Classic',
    subtitle: 'Timeless · Tailored · Refined',
    culture: 'Western',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    accent: '#2980b9',
  },
  {
    id: 'fusion',
    label: 'Eco Fusion',
    subtitle: 'Sustainable · Global · Conscious',
    culture: 'Fusion',
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80',
    accent: '#27ae60',
  },
  {
    id: 'asian',
    label: 'Asian Aesthetic',
    subtitle: 'Minimal · Elegant · Crafted',
    culture: 'Asian',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    accent: '#8e44ad',
  },
];

function CollectionSpotlight({ onSelectCulture }) {
  return (
    <section className="collection-spotlight">
      <div className="collection-header">
        <p className="collection-eyebrow">Curated Collections</p>
        <h2 className="collection-title">Shop by Culture</h2>
        <p className="collection-sub">Fashion that celebrates the world's diversity</p>
      </div>
      <div className="collection-grid">
        {COLLECTIONS.map((col) => (
          <button
            key={col.id}
            className="collection-card"
            onClick={() => onSelectCulture && onSelectCulture(col.culture)}
            style={{ '--accent': col.accent }}
          >
            <div
              className="collection-img"
              style={{ backgroundImage: `url(${col.image})` }}
            />
            <div className="collection-overlay" />
            <div className="collection-content">
              <span className="collection-label">{col.label}</span>
              <span className="collection-subtitle">{col.subtitle}</span>
              <span className="collection-cta">Explore →</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CollectionSpotlight;
