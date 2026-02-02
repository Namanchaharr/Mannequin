import React from 'react';
import './Navbar.css';

const Navbar = ({ visible }) => {
    return (
        <nav className="navbar">
            <div className="nav-left">
                {/* Simple SVG Profile Icon */}
                <svg
                    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
                >
                    <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="nav-center">
                <h1 className="nav-title">MANNEQUIN</h1>
            </div>
            <div className="nav-right">
                {/* Empty for balance or future updates */}
            </div>
        </nav>
    );
};

export default Navbar;
