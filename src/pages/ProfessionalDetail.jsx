// src/pages/ProfessionalDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllProfessionals } from '../data.js';
import StarRating from '../components/StarRating.jsx'; 

const ProfessionalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Load data
    const allProfessionals = getAllProfessionals();
    const professional = allProfessionals.find(p => p.id === parseInt(id));

    // Get current user details
    const getCurrentUser = () => {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    };
    const currentUser = getCurrentUser();

    if (!professional) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
                <h2 style={{ color: 'red' }}>Professional Not Found</h2>
                <p>The profile you requested does not exist.</p>
                <button onClick={() => navigate('/')} className="signin-btn" style={{ marginTop: '20px' }}>
                    Go Back to Search
                </button>
            </div>
        );
    }

    const handleBookingClick = () => {
        if (!currentUser || !currentUser.isLoggedIn) {
            alert("Please sign in to proceed with booking.");
            navigate('/signin');
        } else {
            setIsModalOpen(true); // Open the modal
        }
    };

    const handleConfirmBooking = () => {
        // --- PAYMENT SIMULATION ---
        
        // 1. Create a persistent booking record
        const bookingRecord = {
            proId: professional.id,
            proName: professional.name,
            service: professional.profession,
            rate: professional.rate,
            date: new Date().toLocaleDateString('en-IN'),
            status: 'Completed',
            // Use the user's email as the key to store history
            userEmail: currentUser.email, 
        };

        const key = `bookingHistory_${currentUser.email}`;
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        history.push(bookingRecord);
        localStorage.setItem(key, JSON.stringify(history));


        // 2. Alert and close modal
        alert(`Payment of ₹${professional.rate} is simulated successfully! Booking Confirmed!`);
        
        setIsModalOpen(false); 
    };

    return (
        <div className="main-content" style={{ maxWidth: '800px' }}>
            <button onClick={() => navigate(-1)} className="signin-btn" style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}>
                ← Back to Results
            </button>
            
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    
                    {/* Left Column: Image and Rating */}
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <img 
                            src={professional.image} 
                            alt={professional.name} 
                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #007bff' }}
                        />

                        <div style={{ marginTop: '15px' }}>
                            <StarRating rating={professional.rating} />
                            <p style={{ margin: '5px 0 0', color: '#666' }}>({professional.rating} / 5.0 Rating)</p>
                        </div>

                        {/* Verified Status */}
                        {professional.isVerified && (
                            <div style={{ marginTop: '10px', color: '#28a745', fontWeight: 'bold', fontSize: '16px' }}>
                                ✓ Verified Professional
                            </div>
                        )}
                        
                    </div>

                    {/* Right Column: Details and Skills */}
                    <div style={{ flexGrow: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginTop: 0 }}>
                            {professional.name}
                        </h1>
                        <p style={{ fontSize: '20px', color: '#007bff', fontWeight: '600', marginBottom: '15px' }}>
                            {professional.profession} Specialist
                        </p>
                        
                        {/* Skills Tags */}
                        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {professional.skills && professional.skills.map(skill => (
                                <span key={skill} style={{ backgroundColor: '#e9f0f9', color: '#007bff', padding: '5px 10px', borderRadius: '5px', fontSize: '14px', fontWeight: '600' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '10px' }}>About Me</h3>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{professional.desc}</p>
                        </div>

                        <div style={{ marginTop: '25px', padding: '15px', border: '1px solid #007bff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                                Price: <span style={{ color: '#dc3545' }}>₹{professional.rate}/hr</span>
                            </p>
                            <button onClick={handleBookingClick} className="hire-btn" style={{ fontSize: '18px', padding: '12px 25px' }}>
                                Book Service Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOOKING CONFIRMATION MODAL (UPI) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Confirm Booking & Payment (UPI)</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>You are booking this service for one hour. Total amount due is shown below.</p>

                        <div className="summary-box">
                            <p><strong>Professional:</strong> {professional.name}</p>
                            <p><strong>Service:</strong> {professional.profession}</p>
                            <p><strong>Hourly Rate:</strong> ₹{professional.rate}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
                                Total Amount: <span style={{ color: '#007bff' }}>₹{professional.rate}</span>
                            </p>
                        </div>
                        
                        <div className="payment-details" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                                Scan QR Code to Pay (Simulated)
                            </p>
                            
                            <img 
                                src="/WhatsApp Image 2025-09-29 at 22.58.26_40b3b8a9.jpg" 
                                alt="UPI Payment QR Code Scanner" 
                                style={{ width: '180px', height: '180px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            
                            <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>
                                *Payment is simulated. Confirming below acts as payment completion.*
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                style={{ backgroundColor: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmBooking} 
                                style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Confirm & Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalDetail;