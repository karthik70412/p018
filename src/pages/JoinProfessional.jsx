// src/pages/JoinProfessional.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function for basic email format validation
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const JoinProfessional = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', profession: '', rate: '', desc: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State for validation errors

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear the specific error for the field as the user types
        setErrors(prev => ({ ...prev, [e.target.name]: null })); 
    };

    const runValidation = () => {
        let currentErrors = {};
        
        // 1. Name validation
        if (formData.name.length < 3) {
            currentErrors.name = "Full Name is required (Min 3 chars).";
        }
        
        // 2. Email validation
        if (!validateEmail(formData.email)) {
            currentErrors.email = "Invalid email format.";
        }
        
        // 3. Profession validation
        if (!formData.profession) {
            currentErrors.profession = "Please select a profession.";
        }
        
        // 4. Rate validation (Uses parseFloat and checks for empty string first)
        const rate = parseFloat(formData.rate);
        if (formData.rate === '') {
             currentErrors.rate = "Hourly Rate is required.";
        } else if (isNaN(rate) || rate <= 0) {
            currentErrors.rate = "Rate must be a positive number (₹).";
        }
        
        // 5. Description validation
        if (formData.desc.length < 20) {
            currentErrors.desc = `Description must be at least 20 characters. (Current: ${formData.desc.length})`;
        }
        
        // Update the full error state
        setErrors(currentErrors);
        // The form is valid only if the collected errors object is empty
        return Object.keys(currentErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Re-validate upon submission
        if (!runValidation()) {
            // No need for an extra alert here, as visual feedback shows the errors
            return;
        }
        
        setIsLoading(true);

        setTimeout(() => { // Simulate network delay
            // 2. Create the new professional object
            const newProfessional = {
                id: Date.now(), 
                name: formData.name,
                profession: formData.profession,
                rate: parseInt(formData.rate), 
                desc: formData.desc,
                rating: 5.0, 
                image: "https://images.unsplash.com/photo-1520607162513-7740e53a2c57?w=400&auto=format&fit=crop", 
                skills: [], 
                location: "Unspecified", 
                isVerified: false, 
            };

            // 3. Save the updated list to localStorage
            const existingData = localStorage.getItem('newProfessionals');
            const existingProfessionals = existingData ? JSON.parse(existingData) : [];
            existingProfessionals.push(newProfessional);
            localStorage.setItem('newProfessionals', JSON.stringify(existingProfessionals));

            setIsLoading(false); 
            
            alert(`Success! ${newProfessional.name} (${newProfessional.profession}) is now listed on the platform and available for hire!`);
            
            // Navigate and refresh to show the newly added professional immediately
            navigate('/');
            window.location.reload(); 
        }, 1000);
    };

    const inputStyle = { 
        padding: '12px', border: '1px solid', borderRadius: '5px', marginBottom: '5px', 
        width: '100%', boxSizing: 'border-box'
    };
    
    // Determine if the submit button should be disabled
    const isSubmitDisabled = isLoading || Object.keys(errors).some(key => errors[key] !== null);

    return (
        <div className="signin-page-container">
            <div className="signin-form-box">
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Join Our Network</h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>Register your services to connect with clients.</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.name ? 'red' : '#ccc' }} />
                    {errors.name && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.name}</p>}

                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.email ? 'red' : '#ccc' }} />
                    {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.email}</p>}
                    
                    <select name="profession" value={formData.profession} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.profession ? 'red' : '#ccc' }}>
                        <option value="">Select Profession</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Web Developer">Web Developer</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Photographer">Photographer</option>
                        <option value="Appliance Technician">Appliance Technician</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="Deep Cleaner">Deep Cleaner</option>
                        <option value="Car Mechanic">Car Mechanic</option>
                    </select>
                    {errors.profession && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.profession}</p>}
                    
                    <input type="number" name="rate" placeholder="Hourly Rate (₹)" value={formData.rate} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.rate ? 'red' : '#ccc' }} />
                    {errors.rate && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.rate}</p>}

                    <textarea name="desc" placeholder="Brief Bio / Description (Min 20 chars)" value={formData.desc} onChange={handleChange} onBlur={runValidation} rows="4" style={{ ...inputStyle, borderColor: errors.desc ? 'red' : '#ccc' }}></textarea>
                    {errors.desc && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.desc}</p>}
                    
                    <button 
                        type="submit" 
                        className="signin-submit-btn"
                        disabled={isSubmitDisabled} 
                        style={{ opacity: isSubmitDisabled ? 0.7 : 1, marginTop: '15px' }}
                    >
                        {isLoading ? 'Processing...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default JoinProfessional;