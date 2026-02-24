// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function for basic email format validation
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const SignIn = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); 
    const [errors, setErrors] = useState({}); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({}); // Clear errors as user types
    };

    const runValidation = () => {
        let currentErrors = {};
        if (!validateEmail(formData.email)) {
            currentErrors.email = "Invalid email format.";
        }
        if (formData.password.length < 6) {
            currentErrors.password = "Password must be at least 6 characters.";
        }
        if (isRegistering && formData.name.length < 3) {
            currentErrors.name = "Full Name is required.";
        }
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true); 
        
        setTimeout(() => { 
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === formData.email && u.password === formData.password);

            setIsLoading(false); 

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, isLoggedIn: true, email: user.email }));
                alert(`Welcome back, ${user.name}!`);
                navigate('/');
                window.location.reload(); 
            } else {
                alert("Incorrect credentials. Directing to registration.");
                setIsRegistering(true); 
            }
        }, 800); 
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true); 

        setTimeout(() => { 
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.email === formData.email)) {
                setIsLoading(false);
                alert("Email already exists. Please sign in.");
                setIsRegistering(false);
                return;
            }

            const newUser = { name: formData.name, email: formData.email, password: formData.password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, isLoggedIn: true, email: newUser.email }));
            
            setIsLoading(false); 

            alert(`Welcome, ${newUser.name}!`);
            navigate('/');
            window.location.reload(); 
        }, 1000);
    };

    // UI DESIGN TOKENS
    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '8px',
        color: '#000'
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '14px',
        marginBottom: '4px',
        border: '1px solid',
        borderColor: hasError ? '#000' : '#eee', // Mono error state: Black border instead of red
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontSize: '14px',
        backgroundColor: '#fff',
        outline: 'none',
        transition: 'border-color 0.2s ease'
    });

    const isSubmitDisabled = isLoading || Object.keys(errors).length > 0;

    return (
        <div className="signin-page-container" style={{ backgroundColor: '#fff' }}>
            <div className="signin-form-box" style={{ 
                border: '1px solid #eee', 
                boxShadow: 'none', 
                padding: '50px',
                maxWidth: '450px' 
            }}>
                <h2 style={{ 
                    fontSize: '32px', 
                    fontWeight: '700', 
                    color: '#000', 
                    marginBottom: '8px',
                    letterSpacing: '-1px' 
                }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p style={{ color: '#757575', fontSize: '15px', marginBottom: '40px' }}>
                    {isRegistering ? 'Enter your details to get started.' : 'Sign in to access your dashboard.'}
                </p>
                
                <form onSubmit={isRegistering ? handleRegister : handleLogin} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {isRegistering && (
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} style={inputStyle(errors.name)} required />
                            {errors.name && <p style={{ color: '#000', fontSize: '11px', marginTop: '5px', fontWeight: '600' }}>{errors.name}</p>}
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" name="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} style={inputStyle(errors.email)} required />
                        {errors.email && <p style={{ color: '#000', fontSize: '11px', marginTop: '5px', fontWeight: '600' }}>{errors.email}</p>}
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} style={inputStyle(errors.password)} required />
                        {errors.password && <p style={{ color: '#000', fontSize: '11px', marginTop: '5px', fontWeight: '600' }}>{errors.password}</p>}
                    </div>
                    
                    <button type="submit" className="signin-submit-btn" 
                        style={{ 
                            marginTop: '10px', 
                            height: '50px',
                            backgroundColor: '#000',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '14px',
                            letterSpacing: '0.5px',
                            opacity: isSubmitDisabled ? 0.5 : 1,
                            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer'
                        }} 
                        disabled={isSubmitDisabled}>
                        {isLoading ? 'PLEASE WAIT...' : (isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN')}
                    </button>
                </form>
                
                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '25px', textAlign: 'center' }}>
                    <p style={{ color: '#757575', fontSize: '13px' }}>
                        {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
                        <button 
                            onClick={() => { setIsRegistering(!isRegistering); setErrors({}); }} 
                            style={{ background: 'none', border: 'none', color: '#000', fontWeight: '700', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                            disabled={isLoading}
                        >
                            {isRegistering ? 'SIGN IN' : 'REGISTER NOW'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;