import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, isExpanded, onToggle }) => {
    return (
        <div
            className={`product-card ${isExpanded ? 'expanded' : ''}`}
            style={{ backgroundImage: `url(${product.image})` }}
            onClick={onToggle}
        >
            <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                {isExpanded && <p className="product-desc">{product.description}</p>}
            </div>
        </div>
    );
};

export default ProductCard;
