// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    // State to hold the logged-in user data
    const [currentUser, setCurrentUser] = useState(null);

    // Check for user session when component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('currentUser'); // Clear the session data
        setCurrentUser(null); // Clear state
        alert("You have been signed out.");
        window.location.reload(); // Force page reload to update UI
    };

    return (
        <header className="app-header">
            <Link to="/" className="app-title">
                ProFinder
            </Link>
            <div className="nav-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
                {/* Link for Professional Registration */}
                <Link 
                    to="/join" 
                    style={{ textDecoration: 'none', color: '#007bff', padding: '8px 0', fontWeight: 'bold' }}
                >
                    Join as Professional
                </Link>

                {currentUser && currentUser.isLoggedIn ? (
                    // Display user name and Sign Out button
                    <>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>
                            Hello, {currentUser.name.split(' ')[0]} 👋
                        </span>
                        <button 
                            onClick={handleSignOut} 
                            className="signin-btn" 
                            style={{ backgroundColor: '#dc3545', border: '1px solid #dc3545' }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    // Display Sign In / Register link
                    <Link 
                        to="/signin" 
                        className="signin-btn"
                    >
                        Sign In / Register
                    </Link>
                )}
            </div>
        </header>
    );
};
export default Header;