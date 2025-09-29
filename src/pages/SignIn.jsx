// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const user = users.find(u => u.email === formData.email && u.password === formData.password);

        if (user) {
            // 1. SAVE USER SESSION
            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, isLoggedIn: true }));
            
            alert(`Welcome back, ${user.name}! Successfully signed in.`);
            navigate('/');
            window.location.reload(); // Force header to update
        } else {
            alert("Login failed. User not found or incorrect credentials. Directing to registration.");
            setIsRegistering(true); 
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(u => u.email === formData.email)) {
            alert("Error: A user with this email already exists. Please sign in.");
            setIsRegistering(false);
            return;
        }

        const newUser = { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // 2. SAVE USER SESSION (Auto-login after registration)
        localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, isLoggedIn: true }));

        alert(`Registration successful! Welcome, ${newUser.name}. You are now signed in.`);
        navigate('/');
        window.location.reload(); // Force header to update
    };

    const commonInputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px', 
        border: '1px solid #ccc', 
        borderRadius: '5px' 
    };

    return (
        <div className="signin-page-container">
            <div className="signin-form-box">
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                    {isRegistering ? 'Register as Client' : 'Sign In'}
                </h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                    {isRegistering ? 'Create your new account.' : 'Access your client account.'}
                </p>
                
                <form onSubmit={isRegistering ? handleRegister : handleLogin} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    
                    {isRegistering && (
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={commonInputStyle} required />
                    )}

                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={commonInputStyle} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={commonInputStyle} required />
                    
                    <button type="submit" className="signin-submit-btn" style={{ marginTop: '10px' }}>
                        {isRegistering ? 'Register & Sign In' : 'Sign In'}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
                    {isRegistering ? 'Already have an account? ' : 'Not a client yet? '}
                    <button 
                        onClick={() => setIsRegistering(!isRegistering)} 
                        style={{ background: 'none', border: 'none', color: '#007bff', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                    >
                        {isRegistering ? 'Sign In' : 'Register Now'}
                    </button>
                </p>
            </div>
        </div>
    );
};
export default SignIn;