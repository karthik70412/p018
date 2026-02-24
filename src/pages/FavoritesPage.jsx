// src/pages/FavoritesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllProfessionals } from '../data.js';
import StarRating from '../components/StarRating.jsx';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [allProfessionals] = useState(getAllProfessionals());
    const [favoriteIds, setFavoriteIds] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    useEffect(() => {
        if (currentUser && currentUser.email) {
            if (typeof window !== 'undefined') {
                const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
                setFavoriteIds(favorites);
            }
        }
    }, [currentUser]);

    const favoritedProfessionals = useMemo(() => {
        return allProfessionals.filter(p => favoriteIds.includes(p.id));
    }, [allProfessionals, favoriteIds]);

    const handleRemoveFavorite = (proId) => {
        if (!currentUser) return; 

        const updatedFavorites = favoriteIds.filter(id => id !== proId);
        localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(updatedFavorites));
        
        setFavoriteIds(updatedFavorites);
        alert("Professional removed from your favorites.");
    };

    // UI DESIGN TOKENS (Internal styles for the Mono Theme)
    const headerTitleStyle = {
        fontSize: '42px',
        fontWeight: '800',
        color: '#000',
        letterSpacing: '-1.5px',
        margin: '0 0 10px 0'
    };

    if (!currentUser) {
        return (
            <div className="main-content" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '15px' }}>Access Restricted</h2>
                <p style={{ color: '#757575', marginBottom: '30px' }}>Please Sign In to view your saved favorites.</p>
                <button onClick={() => navigate('/signin')} className="signin-btn">
                    SIGN IN NOW
                </button>
            </div>
        );
    }
    
    return (
        <div className="main-content" style={{ maxWidth: '1200px', margin: '60px auto' }}>
            {/* Header Section consistent with History Page */}
            <header style={{ borderBottom: '2px solid #000', paddingBottom: '30px', marginBottom: '50px' }}>
                <h1 style={headerTitleStyle}>My Favorites</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#757575', margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Saved Experts for {currentUser.email}
                    </p>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>[{favoritedProfessionals.length} SAVED]</span>
                </div>
            </header>

            {favoritedProfessionals.length === 0 ? (
                <div style={{ padding: '80px 0', textAlign: 'center', border: '1px dashed #eee', borderRadius: '8px' }}>
                    <p style={{ fontSize: '18px', color: '#757575' }}>Your favorites list is currently empty.</p>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#000', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer', marginTop: '15px' }}>
                        EXPLORE SERVICES
                    </button>
                </div>
            ) : (
                <section className="results-grid">
                    {favoritedProfessionals.map(p => (
                        <div key={p.id} className="professional-card" style={{ position: 'relative', border: '1px solid #eee' }}>
                            
                            {/* REMOVE FAVORITE BUTTON - Minimalist Black Style */}
                            <button 
                                onClick={() => handleRemoveFavorite(p.id)}
                                style={{ 
                                    position: 'absolute', 
                                    top: '15px', 
                                    right: '15px', 
                                    background: '#000', 
                                    borderRadius: '50%', 
                                    width: '32px', 
                                    height: '32px', 
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    zIndex: 10,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                                }}
                                title="Remove from Favorites"
                            >
                                <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>&times;</span>
                            </button>
                            
                            {/* Card Link */}
                            <Link to={`/professional/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-content" style={{ padding: '24px' }}>
                                    
                                    {/* Top Line (Avatar Initials, Name, Profession) */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ 
                                            width: '45px', 
                                            height: '45px', 
                                            backgroundColor: '#000', 
                                            color: '#fff', 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            marginRight: '12px', 
                                            fontSize: '18px',
                                            fontWeight: '700'
                                        }}>
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0', color: '#000' }}>{p.name}</h3>
                                            <p style={{ color: '#757575', fontWeight: '500', fontSize: '13px', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.profession}</p>
                                        </div>
                                        {p.isVerified && (
                                            <span style={{ marginLeft: 'auto', color: '#000', fontSize: '18px' }}>✓</span>
                                        )}
                                    </div>
                                    
                                    {/* Skills Tags - Outlined Minimalist Chips */}
                                    <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {p.skills.slice(0, 3).map(skill => (
                                            <span key={skill} style={{ border: '1px solid #eee', color: '#757575', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <p style={{ color: '#424242', fontSize: '14px', lineHeight: '1.6', height: '44px', overflow: 'hidden', marginBottom: '20px' }}>{p.desc}</p>

                                    {/* Details (Rating and Price) */}
                                    <div className="card-details" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '700' }}>★ {p.rating}</span>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '800', fontSize: '18px', color: '#000' }}>
                                            ₹{p.rate}<span style={{ fontSize: '12px', fontWeight: '400', color: '#757575' }}> /hr</span>
                                        </p> 
                                    </div>
                                    
                                    <button className="hire-btn" style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                                        VIEW PROFILE
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default FavoritesPage;