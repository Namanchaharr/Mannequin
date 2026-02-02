import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = ({ onInteract }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-container" style={{
            height: '100dvh',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory'
        }}>
            {products.map(product => (
                <ProductCard key={product._id} product={product} onInteract={onInteract} />
            ))}
        </div>
    );
};

export default Home;
