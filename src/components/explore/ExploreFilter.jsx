import React from 'react'

const ExploreFilter = ({ onSortChange }) => {
  return (
    <div>
        <select
            id="filter0items"
            defaultValue=""
            onChange={(e) => onSortChange(e.target.value) }
        >
            <option value="">Default</option>
            <option value="price_low_to_high">Price, low to high</option>
            <option value="price_high_to_low">Price, high to low</option>
            <option value="likes_high_to_low">Most Likes</option>
        </select>
    </div>
  );
};

export default ExploreFilter;