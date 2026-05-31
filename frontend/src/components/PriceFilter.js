import React from 'react';
import PropTypes from 'prop-types';
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

PriceFilter.propTypes = {
  priceRange: PropTypes.shape({
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PriceFilter;
