// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState([]);

    // Get current user details
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    useEffect(() => {
        if (typeof window !== 'undefined' && currentUser && currentUser.email) {
            const key = `bookingHistory_${currentUser.email}`;
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            setBookingHistory(history);
        }
    }, []);

    // --- Access Control Check (Clean & Minimal) ---
    if (!currentUser) {
        return (
            <div className="main-content" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '15px' }}>Access Restricted</h2>
                <p style={{ color: '#757575', marginBottom: '30px' }}>Please Sign In to view your booking history.</p>
                <button onClick={() => navigate('/signin')} className="signin-btn">
                    SIGN IN NOW
                </button>
            </div>
        );
    }
    
    // UI Styling Tokens
    const headerTitleStyle = {
        fontSize: '42px',
        fontWeight: '800',
        color: '#000',
        letterSpacing: '-1.5px',
        margin: '0 0 10px 0'
    };

    const bookingItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 0',
        borderBottom: '1px solid #eee', // Soft divider
        backgroundColor: 'transparent'
    };

    return (
        <div className="main-content" style={{ maxWidth: '900px', margin: '60px auto' }}>
            {/* Header Section */}
            <header style={{ borderBottom: '2px solid #000', paddingBottom: '30px', marginBottom: '40px' }}>
                <h1 style={headerTitleStyle}>Booking History</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#757575', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Transactions for {currentUser.email}
                    </p>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>[{bookingHistory.length} ITEMS]</span>
                </div>
            </header>

            {bookingHistory.length === 0 ? (
                <div style={{ padding: '80px 0', textAlign: 'center', border: '1px dashed #eee', borderRadius: '8px' }}>
                    <p style={{ fontSize: '18px', color: '#757575' }}>No previous bookings found in your account.</p>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#000', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginTop: '15px' }}>
                        BROWSE EXPERTS
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Display cards in reverse order (newest first) */}
                    {bookingHistory.slice().reverse().map((booking, index) => (
                        <div key={index} style={bookingItemStyle}>
                            
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '600', color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Date: {booking.date}
                                </p>
                                <h3 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: '700', color: '#000' }}>
                                    {booking.proName}
                                </h3>
                                <p style={{ margin: 0, color: '#757575', fontSize: '15px', fontWeight: '400' }}>
                                    {booking.service} Specialist
                                </p>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: '800', color: '#000' }}>
                                    ₹{booking.rate}
                                </p>
                                <span style={{ 
                                    border: '1px solid #000', 
                                    color: '#000', 
                                    padding: '5px 12px', 
                                    borderRadius: '4px', 
                                    fontSize: '11px', 
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer style={{ marginTop: '80px', textAlign: 'center' }}>
                <button onClick={() => navigate('/')} style={{ 
                    background: 'none', border: '1px solid #000', color: '#000', 
                    padding: '12px 30px', borderRadius: '4px', fontWeight: '600', 
                    cursor: 'pointer', fontSize: '13px' 
                }}>
                    RETURN TO DIRECTORY
                </button>
            </footer>
        </div>
    );
};

export default HistoryPage;