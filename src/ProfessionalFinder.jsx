import React, { useState, useMemo, useEffect } from 'react';
import { getAllProfessionals, availableCities } from './data.js'; 
import PopularCategories from './components/PopularCategories.jsx'; 
import { Link } from 'react-router-dom'; 
import StarRating from './components/StarRating.jsx'; 
import useDebounce from './hooks/useDebounce.js';

const ProfessionalFinder = () => {
    // --- STATE MANAGEMENT ---
    // Initialize by combining hardcoded data and locally registered pros
    const [allProfessionals, setAllProfessionals] = useState(() => {
        const baseData = getAllProfessionals();
        const localData = JSON.parse(localStorage.getItem('localRegisteredPros') || '[]');
        return [...baseData, ...localData];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [sortByRating, setSortByRating] = useState(false);
    const [locationTerm, setLocationTerm] = useState('');
    const [minRating, setMinRating] = useState('0');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [favoritesKey, setFavoritesKey] = useState(0); 

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const getCurrentUser = () => {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    };
    const currentUser = getCurrentUser();

    // Load favorite IDs from storage
    const favoriteIds = useMemo(() => {
        if (!currentUser || !currentUser.email) return [];
        const key = `favorites_${currentUser.email}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }, [currentUser, favoritesKey]);

    // --- FAVORITES HANDLER ---
    const handleFavoriteToggle = (e, proId) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        if (!currentUser || !currentUser.email) {
            alert("Please sign in to save favorites.");
            return;
        }
        const key = `favorites_${currentUser.email}`;
        let favorites = JSON.parse(localStorage.getItem(key) || '[]');
        if (favorites.includes(proId)) {
            favorites = favorites.filter(id => id !== proId);
        } else {
            favorites.push(proId);
        }
        localStorage.setItem(key, JSON.stringify(favorites));
        setFavoritesKey(prev => prev + 1); 
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedProfession('');
        setLocationTerm('');
        setMinRating('0');
        setMinRate('');
        setMaxRate('');
        setSortByRating(false);
        setAvailabilityFilter('');
    };

    // --- FILTERING LOGIC ---
    const filteredAndSortedProfessionals = useMemo(() => {
        let list = [...allProfessionals]; 
        const termLower = debouncedSearchTerm.toLowerCase();
        list = list.filter(p => (
            p.name.toLowerCase().includes(termLower) || 
            p.profession.toLowerCase().includes(termLower) ||
            p.desc.toLowerCase().includes(termLower)
        ));
        if (selectedProfession) list = list.filter(p => p.profession === selectedProfession);
        const locLower = locationTerm.toLowerCase();
        if (locLower) list = list.filter(p => p.location?.toLowerCase().includes(locLower));
        
        const minR = parseInt(minRate) || 0; 
        const maxR = parseInt(maxRate) || Infinity; 
        list = list.filter(p => p.rate >= minR && p.rate <= maxR);
        list = list.filter(p => p.rating >= parseFloat(minRating));
        list = list.filter(p => availabilityFilter === '' || (availabilityFilter === 'available' && p.isAvailable));

        if (sortByRating) list.sort((a, b) => b.rating - a.rating);
        return list;
    }, [debouncedSearchTerm, selectedProfession, sortByRating, allProfessionals, minRate, maxRate, locationTerm, minRating, availabilityFilter]);

    // --- Location Autocomplete ---
    const locationSuggestions = useMemo(() => {
        if (locationTerm.length < 2) return []; 
        const termLower = locationTerm.toLowerCase();
        return availableCities.filter(city => city.toLowerCase().includes(termLower)).slice(0, 5);
    }, [locationTerm]);

    return (
        <main className="main-content">
            <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#000', marginBottom: '30px', textAlign: 'center', letterSpacing: '-1px' }}>
                Find Your Expert
            </h1>
            
            <PopularCategories 
                setSelectedProfession={setSelectedProfession}
                setSearchTerm={setSearchTerm} 
            />

            <section className="controls-section">
                <div style={{ position: 'relative' }} className="search-input-group">
                    <input
                        type="text"
                        placeholder="Search services (e.g. Plumber, Electrician)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Location..."
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                    />
                    {locationSuggestions.length > 0 && (
                        <div style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #eee', width: '100%', marginTop: '5px' }}>
                            {locationSuggestions.map(city => (
                                <div key={city} onClick={() => setLocationTerm(city)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}>
                                    {city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)}>
                    <option value="">All Services</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Web Developer">Developer</option>
                </select>

                <input type="number" placeholder="Min ₹" value={minRate} onChange={(e) => setMinRate(e.target.value)} />
                <input type="number" placeholder="Max ₹" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
                
                <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                    <option value="0">Rating (Any)</option>
                    <option value="4.5">4.5 & Up</option>
                    <option value="4.0">4.0 & Up</option>
                </select>

                <button
                    style={{ 
                        backgroundColor: sortByRating ? '#000' : '#fff', 
                        color: sortByRating ? '#fff' : '#000',
                        border: '1px solid #000',
                        cursor: 'pointer'
                    }}
                    onClick={() => setSortByRating(!sortByRating)}
                >
                    {sortByRating ? 'Rating High ↓' : 'Sort by Rating'}
                </button>
                
                <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: '#757575', textDecoration: 'underline', cursor: 'pointer' }}>
                    Reset Filters
                </button>
            </section>

            <div style={{ borderBottom: '1px solid #eee', marginBottom: '30px', paddingBottom: '10px' }}>
                <span style={{ fontSize: '14px', color: '#757575', fontWeight: '500' }}>
                    RESULTS: {filteredAndSortedProfessionals.length} Experts found
                </span>
            </div>

            <section className="results-grid">
                {filteredAndSortedProfessionals.map(p => (
                    <div key={p.id} className="professional-card" style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => handleFavoriteToggle(e, p.id)}
                            style={{
                                position: 'absolute', top: '15px', right: '15px', 
                                background: 'rgba(255,255,255,0.8)', borderRadius: '50%', 
                                width: '35px', height: '35px', display: 'flex',
                                justifyContent: 'center', alignItems: 'center',
                                border: '1px solid #eee', cursor: 'pointer', zIndex: 10,
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill={favoriteIds.includes(p.id) ? '#000' : 'none'} stroke="#000" strokeWidth="2" width="18px" height="18px">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>

                        <Link to={`/professional/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card-content" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', backgroundColor: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '18px', fontWeight: 'bold' }}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0', color: '#000' }}>{p.name}</h3>
                                        <p style={{ color: '#757575', fontWeight: '500', fontSize: '13px', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.profession}</p>
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {p.skills?.slice(0, 3).map(skill => (
                                        <span key={skill} className="skill-tag" style={{ border: '1px solid #eee', color: '#757575', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                
                                <p style={{ color: '#424242', fontSize: '14px', lineHeight: '1.6', height: '44px', overflow: 'hidden', marginBottom: '20px' }}>{p.desc}</p>
                                
                                <div className="card-details" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '700' }}>★ {p.rating}</span>
                                    </div>
                                    <p style={{ margin: 0, fontWeight: '800', fontSize: '16px' }}>₹{p.rate}<span style={{ fontSize: '12px', fontWeight: '400', color: '#757575' }}> /hr</span></p> 
                                </div>
                                
                                <button className="hire-btn" style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                                    VIEW PROFILE
                                </button>
                            </div>
                        </Link>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default ProfessionalFinder;