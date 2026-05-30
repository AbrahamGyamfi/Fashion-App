import React from 'react';
import './TrendBanner.css';

const TRENDS = [
  'African Prints',
  'Sustainable Fashion',
  'Oversized Blazers',
  'Wide Leg Trousers',
  'Eco-Friendly Fabrics',
  'Kente Fusion',
  'Minimalist Layers',
  'Bold Colour Blocking',
  'Vintage Revival',
  'Cultural Heritage Wear',
  'Street Luxe',
  'Conscious Dressing',
];

function TrendBanner() {
  const items = [...TRENDS, ...TRENDS];
  return (
    <div className="trend-banner">
      <div className="trend-track">
        {items.map((t, i) => (
          <span key={i} className="trend-item">
            <span className="trend-dot">●</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TrendBanner;
