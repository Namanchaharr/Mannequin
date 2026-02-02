import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onInteract }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`product-card ${expanded ? 'expanded' : ''}`}
            style={{ backgroundImage: `url(${product.image})` }}
            onClick={() => {
                setExpanded(!expanded);
                if (onInteract) onInteract();
            }}
        >
            <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                {expanded && <p className="product-desc">{product.description}</p>}
            </div>
        </div>
    );
};

export default ProductCard;
