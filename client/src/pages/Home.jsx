import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = ({ expandedId, setExpandedId, onScrollChange }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const viewportHeight = e.target.clientHeight;

        // "As soon as i scroll make the text and icons disappear" - Close expanded state
        // We use a small threshold to avoid accidental jitters, e.g., 10px
        if (expandedId && Math.abs(scrollTop - (products.find(p => p._id === expandedId)?.index || 0) * viewportHeight) > 50) {
            // Logic to close is tricky if we don't track scroll start. 
            // simpler: If expandedId is set, any scroll event > threshold closes it.
            // But handleScroll fires constantly.
            // Better: just setExpandedId(null) if expandedId is true.
            setExpandedId(null);
        } else if (expandedId) {
            // If we just mapped keys/indexes we could be smarter, but let's stick to the "Action" -> "Scroll" -> "Reset" flow.
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
                    key={product._id}
                    product={product}
                    isExpanded={expandedId === product._id}
                    onToggle={() => setExpandedId(expandedId === product._id ? null : product._id)}
                />
            ))}
        </div>
    );
};

export default Home;
