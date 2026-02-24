// src/pages/JoinProfessional.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const JoinProfessional = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', profession: '', rate: '', desc: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: null })); 
    };

    const runValidation = () => {
        let currentErrors = {};
        if (formData.name.length < 3) currentErrors.name = "Full Name is required.";
        if (!validateEmail(formData.email)) currentErrors.email = "Invalid email format.";
        if (!formData.profession) currentErrors.profession = "Select a profession.";
        const rate = parseFloat(formData.rate);
        if (isNaN(rate) || rate <= 0) currentErrors.rate = "Enter a valid hourly rate.";
        if (formData.desc.length < 20) currentErrors.desc = "Min 20 characters required.";
        
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true);

        // Create the new professional object
        const newProfessional = {
            id: Date.now(), // Unique ID
            name: formData.name,
            profession: formData.profession,
            rate: parseInt(formData.rate), 
            desc: formData.desc,
            rating: 5.0, 
            image: "https://images.unsplash.com/photo-1520607162513-7740e53a2c57?w=400&auto-format&fit=crop", 
            skills: ["Expert Service"], 
            location: "New Delhi", 
            isVerified: true, 
            isAvailable: true
        };

        // --- Bypassing Backend: Save to LocalStorage ---
        setTimeout(() => {
            try {
                // Get existing local pros or empty array
                const localPros = JSON.parse(localStorage.getItem('localRegisteredPros') || '[]');
                localPros.push(newProfessional);
                localStorage.setItem('localRegisteredPros', JSON.stringify(localPros));

                alert(`Success! ${newProfessional.name} has been added to the directory.`);
                setIsLoading(false);
                navigate('/');
                window.location.reload(); 
            } catch (err) {
                console.error(err);
                setIsLoading(false);
                alert("Submission failed locally.");
            }
        }, 1000);
    };

    // Premium UI Styles
    const labelStyle = {
        display: 'block', fontSize: '11px', fontWeight: '600', 
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#000'
    };

    const inputStyle = (hasError) => ({
        padding: '14px', border: '1px solid', borderRadius: '4px', marginBottom: '5px', 
        width: '100%', boxSizing: 'border-box', outline: 'none',
        borderColor: hasError ? '#000' : '#eee', fontSize: '14px'
    });

    const isSubmitDisabled = isLoading || Object.keys(errors).some(key => errors[key] !== null);

    return (
        <div className="signin-page-container" style={{ backgroundColor: '#fff' }}>
            <div className="signin-form-box" style={{ border: '1px solid #eee', boxShadow: 'none', padding: '50px', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '10px', letterSpacing: '-1px' }}>Join Our Network</h2>
                <p style={{ color: '#757575', marginBottom: '40px', fontSize: '15px' }}>Register as a professional to reach more clients.</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} style={inputStyle(errors.name)} />
                        {errors.name && <p style={{ color: '#000', fontSize: '11px', fontWeight: '700', marginTop: '5px' }}>{errors.name}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} style={inputStyle(errors.email)} />
                        {errors.email && <p style={{ color: '#000', fontSize: '11px', fontWeight: '700', marginTop: '5px' }}>{errors.email}</p>}
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Profession</label>
                        <select name="profession" value={formData.profession} onChange={handleChange} style={inputStyle(errors.profession)}>
                            <option value="">Select Profession</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Web Developer">Web Developer</option>
                        </select>
                        {errors.profession && <p style={{ color: '#000', fontSize: '11px', fontWeight: '700', marginTop: '5px' }}>{errors.profession}</p>}
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Hourly Rate (₹)</label>
                        <input type="number" name="rate" placeholder="500" value={formData.rate} onChange={handleChange} style={inputStyle(errors.rate)} />
                        {errors.rate && <p style={{ color: '#000', fontSize: '11px', fontWeight: '700', marginTop: '5px' }}>{errors.rate}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Bio / Description</label>
                        <textarea name="desc" placeholder="Tell clients about your expertise..." value={formData.desc} onChange={handleChange} rows="4" style={inputStyle(errors.desc)}></textarea>
                        {errors.desc && <p style={{ color: '#000', fontSize: '11px', fontWeight: '700', marginTop: '5px' }}>{errors.desc}</p>}
                    </div>
                    
                    <button type="submit" className="signin-submit-btn" disabled={isSubmitDisabled} 
                        style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '4px', fontWeight: '700', marginTop: '15px', cursor: isSubmitDisabled ? 'not-allowed' : 'pointer', opacity: isSubmitDisabled ? 0.5 : 1 }}>
                        {isLoading ? 'PROCESSING...' : 'SUBMIT APPLICATION'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default JoinProfessional;