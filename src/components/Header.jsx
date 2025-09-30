import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null); 
        alert("You have been signed out.");
        window.location.reload(); 
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
                    // Display links when logged in
                    <>
                        {/* 👈 BOOKING HISTORY LINK */}
                        <Link 
                            to="/history" 
                            style={{ textDecoration: 'none', color: '#333', padding: '8px 0', fontWeight: 'bold' }}
                        >
                            <span title="Booking History">🕒 History</span>
                        </Link>
                        
                        {/* Favorites Link */}
                        <Link 
                            to="/favorites" 
                            style={{ textDecoration: 'none', color: '#333', padding: '8px 0', fontWeight: 'bold' }}
                        >
                            ❤️ Favorites
                        </Link>

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