import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = ({ expandedId, setExpandedId, onScrollChange, showOutlines, onCategoryClick }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/products';
                const response = await axios.get(apiUrl);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
            {loading ? (
                <div className="loading-state">Loading Showcase...</div>
            ) : (
                products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isExpanded={expandedId === product.id}
                        onToggle={() => setExpandedId(expandedId === product.id ? null : product.id)}
                        showOutlines={showOutlines}
                        onCategoryClick={onCategoryClick}
                    />
                ))
            )}
        </div>
    );
};

export default Home;
