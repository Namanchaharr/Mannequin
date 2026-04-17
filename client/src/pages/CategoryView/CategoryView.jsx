import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import CartButton from '../components/CartButton';
import LoginModal from '../components/LoginModal';
import './CategoryView.css';

const CategoryView = ({ category, onBack }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showTitle, setShowTitle] = useState(true);
    const [cartVisible, setCartVisible] = useState(false);

    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const sentinelRef = useRef(null);
    const containerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const LIMIT = 5;

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (user) => {
        setIsAuthenticated(true);
    };

    const handleCartClick = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
        } else {
            // Cart is active, future cart functionality goes here
        }
    };

    const fetchProducts = useCallback(async (pageNum) => {
        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL
                ? import.meta.env.VITE_API_URL.replace('/api/products', '')
                : 'http://localhost:8080';
            const response = await axios.get(
                `${apiBase}/api/products/category/${category}?page=${pageNum}&limit=${LIMIT}`
            );
            if (response.data && response.data.length > 0) {
                setProducts(prev => [...prev, ...response.data]);
            }
        } catch (error) {
            console.error('Error fetching category products:', error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [category]);

    // Initial fetch
    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchProducts(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [loading, fetchProducts]);

    // Swipe-back gesture
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e) => {
            touchStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        };

        const handleTouchEnd = (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
            if (deltaX > 80 && deltaY < 100) {
                onBack();
            }
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onBack]);

    // Title visibility on scroll (same logic as landing page)
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const viewportHeight = e.target.clientHeight;
        const isPastSecondPage = scrollTop > (viewportHeight * 1.5);
        setShowTitle(!isPastSecondPage);

        // Hide buttons on scroll (same as landing page collapsing on scroll)
        if (cartVisible) {
            setCartVisible(false);
        }
    };

    const handleCardClick = (e) => {
        // Don't toggle if clicking on a button
        if (e.target.closest('.category-back-btn') || e.target.closest('.cart-button') || e.target.closest('.link-button')) return;
        setCartVisible(prev => !prev);
    };

    if (initialLoading) {
        return <div className="loading-state">Loading {category}...</div>;
    }

    return (
        <div className="category-view" ref={containerRef} onScroll={handleScroll} onClick={handleCardClick}>
            {/* Navbar - identical to landing page */}
            <nav className="category-navbar">
                <div className="cat-nav-left">
                    <button className="category-back-btn" onClick={onBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="cat-nav-center">
                    <h1
                        className="cat-nav-title"
                        style={{
                            opacity: showTitle ? 1 : 0,
                            transition: 'opacity 2s ease'
                        }}
                    >{category.toUpperCase()}</h1>
                </div>
                <div className="cat-nav-right"></div>
            </nav>

            {/* Bottom buttons: Cart (left) + Link (right) */}
            <button
                className={`link-button ${cartVisible ? 'visible' : ''}`}
                onClick={handleCartClick}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 20C9 21.1046 8.10457 22 7 22C5.89543 22 5 21.1046 5 20C5 18.8954 5.89543 18 7 18C8.10457 18 9 18.8954 9 20Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 20C20 21.1046 19.1046 22 18 22C16.8954 22 16 21.1046 16 20C16 18.8954 16.8954 18 18 18C19.1046 18 20 18.8954 20 20Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <CartButton
                visible={cartVisible}
                isActive={false}
                onToggle={() => {}}
            />

            {products.map((product, index) => (
                <div className="category-card" key={`${product.id}-${index}`}>
                    <img src={product.image} alt={product.name} className="category-card-image" />
                </div>
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="scroll-sentinel">
                {loading && <div className="loading-more">Loading...</div>}
            </div>

            {/* Login Modal - triggered by cart click */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
            />
        </div>
    );
};

export default CategoryView;
