import React from 'react';
import './PriceFilter.css';

function PriceFilter({ priceRange, onChange }) {
  return (
    <div className="price-filter">
      <input
        type="number"
        placeholder="Min $"
        value={priceRange.min}
        onChange={(e) => onChange({ ...priceRange, min: e.target.value })}
        min="0"
      />
      <span className="separator">-</span>
      <input
        type="number"
        placeholder="Max $"
        value={priceRange.max}
        onChange={(e) => onChange({ ...priceRange, max: e.target.value })}
        min="0"
      />
    </div>
  );
}

export default PriceFilter;
