import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';

const Home = ({ expandedId, setExpandedId, onScrollChange }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Use mock data for static deployment
        setProducts(mockProducts);
    }, []);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const viewportHeight = e.target.clientHeight;

        // Close expanded state on scroll
        if (expandedId) {
            setExpandedId(null);
        }

        // Title Logic: Past 2nd page (approx 1.5 - 1.9vh)
        const isPastSecondPage = scrollTop > (viewportHeight * 1.5);
        if (onScrollChange) {
            onScrollChange(!isPastSecondPage);
        }
    };

    return (
        <div
            className="home-container"
            style={{
                height: '100dvh',
                overflowY: 'scroll',
                scrollSnapType: 'y mandatory'
            }}
            onScroll={handleScroll}
        >
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isExpanded={expandedId === product.id}
                    onToggle={() => setExpandedId(expandedId === product.id ? null : product.id)}
                />
            ))}
        </div>
    );
};

export default Home;
