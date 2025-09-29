import React from 'react';

const SignIn = () => {
  return (
    <div className="signin-page-container">
      <div className="signin-form-box">
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Welcome Back</h2>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
          />
          <input 
            type="password" 
            placeholder="Password" 
          />
          <button 
            type="submit" 
            className="signin-submit-btn"
          >
            Sign In
          </button>
        </form>
        
        <p style={{ marginTop: '15px', color: '#666' }}>
          Don't have an account? <a href="#" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Register Now</a>
        </p>
      </div>
    </div>
  );
};
export default SignIn;