// src/components/StarRating.jsx
import React from 'react';

const StarRating = ({ rating }) => {
    // Round rating to the nearest half (e.g., 4.3 -> 4.5)
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];

    // Add full stars (★)
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} style={{ color: '#ffc107' }}>★</span>);
    }
    
    // Add half star (using opacity for simplicity)
    if (halfStar) {
        stars.push(<span key="half" style={{ color: '#ffc107', opacity: 0.5 }}>★</span>); 
    }

    // Add empty stars (☆)
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} style={{ color: '#ccc' }}>★</span>);
    }

    return (
        <div style={{ display: 'inline-flex', gap: '2px', fontSize: '18px' }} title={`${rating} out of 5 stars`}>
            {stars}
        </div>
    );
};

export default StarRating;