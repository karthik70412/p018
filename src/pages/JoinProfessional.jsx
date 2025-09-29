// src/pages/JoinProfessional.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProfessionals } from '../data.js'; 

const JoinProfessional = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', profession: '', rate: '', desc: '', email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Create the new professional object
        const newProfessional = {
            id: Date.now(), // Unique ID
            name: formData.name,
            profession: formData.profession,
            rate: parseInt(formData.rate), 
            desc: formData.desc,
            rating: 5.0, // Default perfect rating for a new user
            image: "https://images.unsplash.com/photo-1520607162513-7740e53a2c57?w=400&auto=format&fit=crop", // Default placeholder image
        };

        // 2. Load existing professionals from localStorage (only the manually added ones)
        const existingData = localStorage.getItem('newProfessionals');
        const existingProfessionals = existingData ? JSON.parse(existingData) : [];
        
        // 3. Save the updated list back to localStorage
        existingProfessionals.push(newProfessional);
        localStorage.setItem('newProfessionals', JSON.stringify(existingProfessionals));

        // 4. Alert user and navigate to homepage 
        alert(`Success! ${newProfessional.name} (${newProfessional.profession}) is now listed on the platform!`);
        
        navigate('/');
        window.location.reload(); 
    };

    return (
        <div className="signin-page-container">
            <div className="signin-form-box">
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Join Our Network</h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>Register your services to connect with clients.</p>
                
                {/* Form uses onSubmit handler */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    
                    <select name="profession" value={formData.profession} onChange={handleChange} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px' }} required>
                        <option value="">Select Profession</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Web Developer">Web Developer</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Photographer">Photographer</option>

                        {/* 👈 NEW PROFESSIONS ADDED HERE */}
                        <option value="Appliance Technician">Appliance Technician</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="Deep Cleaner">Deep Cleaner</option>
                        <option value="Car Mechanic">Car Mechanic</option>
                    </select>
                    
                    <input type="number" name="rate" placeholder="Hourly Rate (₹)" value={formData.rate} onChange={handleChange} required />
                    <textarea name="desc" placeholder="Brief Bio / Description" value={formData.desc} onChange={handleChange} rows="4" style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} required></textarea>
                    
                    <button 
                        type="submit" 
                        className="signin-submit-btn"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
};
export default JoinProfessional;