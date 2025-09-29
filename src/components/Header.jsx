import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="app-title">
        ProFinder
      </Link>
      <div className="nav-links">
        <Link 
          to="/signin" 
          className="signin-btn"
        >
          Sign In / Register
        </Link>
      </div>
    </header>
  );
};
export default Header;