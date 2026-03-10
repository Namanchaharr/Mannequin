import React from 'react';
import './ProductCard.css';
import { mockOutlines } from '../data/mockOutlines';

const TagIcon = ({ iconType }) => {
    switch(iconType) {
        case 'top':
            return <svg viewBox="0 0 24 24"><path d="M20 5.61A2 2 0 0 0 18.66 4l-4.22-1.05A2 2 0 0 0 13.94 2h-3.88a2 2 0 0 0-1.5.95L4.34 4A2 2 0 0 0 3 5.61v2.33a2 2 0 0 0 .72 1.54 2 2 0 0 0 2.28 0v8.52a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9.48a2 2 0 0 0 2.28 0 2 2 0 0 0 .72-1.54V5.61Z" /></svg>;
        case 'bottom':
            return <svg viewBox="0 0 24 24"><path d="M10 21V9M14 21V9M5 21l1-12c.3-2 1-5 6-5s5.7 3 6 5l1 12M5 21h4M15 21h4"/></svg>;
        case 'shoes':
            return <svg viewBox="0 0 24 24"><path d="M2 18h20v-2c0-1.1-.9-2-2-2H9C7 10 5 10 3 11l-1 5Z" /><path d="M10 14h5M10 10h2" /></svg>;
        case 'outerwear':
            return <svg viewBox="0 0 24 24"><path d="M12 21V5M12 5C10 3 7 3 5 5L3 9v12h4v-7c0-1 1-2 2.5-2S12 13 12 14v7h4v-7c0-1 1-2 2.5-2S21 13 21 14v7h-4M12 5c2-2 5-2 7 0l2 4"/></svg>;
        case 'dress':
            return <svg viewBox="0 0 24 24"><path d="M10 3L6 9l-2 10h16l-2-10-4-6h-4Z"/><path d="M6 9h12"/></svg>;
        default:
            return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>;
    }
};

const ProductCard = ({ product, isExpanded, onToggle, showOutlines, onCategoryClick }) => {
    // Attempt to grab custom outlines for this specific image name
    const outlineData = mockOutlines[product.name] || {
        viewBox: "0 0 100 100",
        items: [
            { id: "fallback-top", type: "top-item", points: "25,20 75,20 80,45 20,45" },
            { id: "fallback-bottom", type: "bottom-item", points: "30,48 70,48 65,85 35,85" }
        ],
        tags: []
    };

    const handleCardClick = () => {
        if (isExpanded) {
            // Collapse the expanded card
            onToggle();
        } else if (onCategoryClick && product.category) {
            // Navigate to category view
            onCategoryClick(product.category);
        } else {
            // Fallback to toggle behavior
            onToggle();
        }
    };

    return (
        <div
            className={`product-card ${isExpanded ? 'expanded' : ''}`}
            onClick={handleCardClick}
        >
            <img src={product.image} alt={product.name} className="product-image" />
            
            {isExpanded && showOutlines && (
                <div className="outlines-container">
                    <svg viewBox={outlineData.viewBox} preserveAspectRatio="xMidYMid slice">
                        {outlineData.items.map((outline) => (
                            <polygon 
                                key={outline.id} 
                                points={outline.points} 
                                className={`clothing-outline ${outline.type}`} 
                            />
                        ))}
                        {outlineData.tags && outlineData.tags.map((tag) => (
                            <foreignObject x={tag.x} y={tag.y} width="50" height="50" key={tag.id} className="clothing-tag-container">
                                <div className="clothing-tag" onClick={(e) => e.stopPropagation()}>
                                    <TagIcon iconType={tag.icon} />
                                </div>
                            </foreignObject>
                        ))}
                    </svg>
                </div>
            )}

            {!isExpanded && (
                <div className="product-info">
                    <h2 className="product-name">{product.name}</h2>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
