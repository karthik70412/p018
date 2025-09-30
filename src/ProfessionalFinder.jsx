import React, { useState, useMemo } from 'react';
import { getAllProfessionals, availableCities } from './data.js';
import PopularCategories from './components/PopularCategories.jsx'; 
import { Link } from 'react-router-dom'; 
import StarRating from './components/StarRating.jsx'; 
import useDebounce from './hooks/useDebounce.js';

const ProfessionalFinder = () => {
    const [allProfessionals] = useState(getAllProfessionals());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [sortByRating, setSortByRating] = useState(false);
    
    const [locationTerm, setLocationTerm] = useState('');
    const [minRating, setMinRating] = useState('0');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');
    
    // State to force re-render when favorites change
    const [favoritesKey, setFavoritesKey] = useState(0); 
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Get current user details and their favorites
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
    }, [currentUser, favoritesKey]); // Re-calculates when favoritesKey changes

    // --- FAVORITES HANDLER ---
    const handleFavoriteToggle = (e, proId) => {
        e.preventDefault(); // Stop navigation to detail page
        e.stopPropagation(); // Stop event bubbling

        if (!currentUser || !currentUser.email) {
            alert("Please sign in to save favorites.");
            return;
        }
        
        const key = `favorites_${currentUser.email}`;
        let favorites = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (favorites.includes(proId)) {
            // Remove favorite
            favorites = favorites.filter(id => id !== proId);
            alert("Removed from favorites!");
        } else {
            // Add favorite
            favorites.push(proId);
            alert("Added to favorites! View in My Favorites.");
        }
        localStorage.setItem(key, JSON.stringify(favorites));
        
        // Force re-render of this component to update heart icon state
        setFavoritesKey(prev => prev + 1); 
    };

    // --- UTILITY HANDLERS (Unchanged) ---
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedProfession('');
        setLocationTerm('');
        setMinRating('0');
        setMinRate('');
        setMaxRate('');
        setSortByRating(false);
    };
    const handleClearSearch = () => setSearchTerm('');

    // --- FILTERING LOGIC (useMemo) ---
    const filteredAndSortedProfessionals = useMemo(() => {
        let list = [...allProfessionals]; 
        
        // 1. Apply Search (Name, Profession, Description)
        const termLower = debouncedSearchTerm.toLowerCase();
        list = list.filter(p => {
            const matchesNamePro = p.name.toLowerCase().includes(termLower) || p.profession.toLowerCase().includes(termLower);
            const matchesDescription = p.desc.toLowerCase().includes(termLower);
            return matchesNamePro || matchesDescription;
        });

        // 2. Apply Profession Filter
        if (selectedProfession) {
            list = list.filter(p => p.profession === selectedProfession);
        }
        
        // 3. Apply Location Filter
        const locationLower = locationTerm.toLowerCase();
        if (locationLower) {
             list = list.filter(p => p.location && p.location.toLowerCase().includes(locationLower));
        }

        // 4. Apply Price Range Filter
        const minR = parseInt(minRate) || 0; 
        const maxR = parseInt(maxRate) || Infinity; 
        list = list.filter(p => p.rate >= minR && p.rate <= maxR);
        
        // 5. Apply Minimum Rating Filter
        const requiredRating = parseFloat(minRating);
        list = list.filter(p => p.rating >= requiredRating);
        
        // 6. Apply Sort
        if (sortByRating) {
            list.sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [debouncedSearchTerm, selectedProfession, sortByRating, allProfessionals, minRate, maxRate, locationTerm, minRating]);

    // --- Location Autocomplete Simulation ---
    const locationSuggestions = useMemo(() => {
        if (locationTerm.length < 2) return []; 
        const termLower = locationTerm.toLowerCase();
        return availableCities.filter(city => city.toLowerCase().includes(termLower)).slice(0, 5);
    }, [locationTerm]);

    // --- UI RENDER (JSX) ---
    return (
        <main className="main-content">
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
                Find & Hire the Right Professional
            </h1>
            
            <PopularCategories 
                setSelectedProfession={setSelectedProfession}
                setSearchTerm={setSearchTerm} 
            />

            {/* Controls Section */}
            <section className="controls-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                
                {/* Search Bar with Clear Icon */}
                <div style={{ position: 'relative', gridColumn: 'span 2 / span 2' }}>
                    <input
                        type="text"
                        placeholder="Search name/profession/keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {searchTerm && (
                        <button 
                            onClick={handleClearSearch}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', padding: '0', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    )}
                </div>
                
                {/* Location Filter with Autocomplete */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Filter by City/Area..."
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {locationSuggestions.length > 0 && (
                        <div style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #ccc', borderRadius: '5px', width: '100%', maxHeight: '200px', overflowY: 'auto', marginTop: '5px' }}>
                            {locationSuggestions.map(city => (
                                <div 
                                    key={city} 
                                    onClick={() => { setLocationTerm(city); }}
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                >
                                    {city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profession Filter */}
                <select
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                >
                    <option value="">All Services</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Appliance Technician">Appliance Technician</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Deep Cleaner">Deep Cleaner</option>
                    <option value="Car Mechanic">Car Mechanic</option>
                </select>

                {/* Price Range Filters */}
                <input
                    type="number"
                    placeholder="Min Rate (₹)"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Rate (₹)"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                />
                
                {/* Minimum Rating Filter (Visual options) */}
                <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                >
                    <option value="0">Min Rating (Any)</option>
                    <option value="4.5">★★★★★ 4.5 & Up</option>
                    <option value="4.0">★★★★☆ 4.0 & Up</option>
                    <option value="3.5">★★★☆☆ 3.5 & Up</option>
                </select>

                {/* Sort Button */}
                <button
                    style={{ backgroundColor: sortByRating ? '#28a745' : '#ccc', color: sortByRating ? 'white' : '#333' }}
                    onClick={() => setSortByRating(!sortByRating)}
                >
                    {sortByRating ? 'Rating High ↓' : 'Sort by Rating'}
                </button>
                
                {/* Clear All Filters Button */}
                <button
                    onClick={handleClearFilters}
                    style={{ backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold' }}
                >
                    Clear All Filters
                </button>
            </section>

            {/* FEATURE: Filter Count Display */}
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0 10px', color: '#333' }}>
                Showing {filteredAndSortedProfessionals.length} of {allProfessionals.length} Professionals
            </h2>

            {/* Results Display Section */}
            <section className="results-grid">
                {filteredAndSortedProfessionals.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>
                        Sorry, no professionals match your criteria. Try adjusting your search.
                    </p>
                ) : (
                    filteredAndSortedProfessionals.map(p => (
                        <div key={p.id} className="professional-card" style={{ position: 'relative' }}>
                            
                            {/* 👈 UPDATED FAVORITES ICON (SVG) */}
                            <button
                                onClick={(e) => handleFavoriteToggle(e, p.id)}
                                style={{
                                    position: 'absolute', 
                                    top: '10px', 
                                    right: '10px', 
                                    background: 'white', // White background
                                    borderRadius: '50%', // Circular shape
                                    width: '40px',        // Fixed size
                                    height: '40px',       // Fixed size
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid #ddd', // Light border
                                    cursor: 'pointer', 
                                    zIndex: 10,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow
                                    transition: 'background-color 0.2s, border-color 0.2s',
                                }}
                                title={favoriteIds.includes(p.id) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill={favoriteIds.includes(p.id) ? '#dc3545' : '#ccc'} // Red if favorited, else gray
                                    width="24px" 
                                    height="24px"
                                    style={{ 
                                        transition: 'fill 0.2s', // Smooth color transition
                                    }}
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>

                            <Link 
                                to={`/professional/${p.id}`} 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="card-content">
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '30px', marginRight: '10px', color: '#007bff' }}>👤</span> 
                                        
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{p.name}</h3>
                                            <p style={{ color: '#007bff', fontWeight: '600', fontSize: '14px', margin: '0' }}>{p.profession}</p>
                                        </div>
                                        
                                        {/* Verified Badge Simulation */}
                                        {p.isVerified && (
                                            <span title="Verified Professional" style={{ color: '#28a745', marginLeft: '10px', fontSize: '20px' }}>
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Skills Tags */}
                                    <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {p.skills.slice(0, 3).map(skill => (
                                            <span key={skill} style={{ backgroundColor: '#f0f0f0', color: '#555', padding: '3px 8px', borderRadius: '3px', fontSize: '12px' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{p.desc}</p>
                                    
                                    <div className="card-details" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <StarRating rating={p.rating} />
                                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>({p.rating})</p>
                                        </div>
                                        <p style={{ margin: 0 }}>💰 ₹{p.rate}/hr</p> 
                                    </div>
                                    
                                    <button 
                                        className="hire-btn"
                                        style={{ marginTop: '15px', backgroundColor: '#3498db' }}
                                    >
                                        View Profile & Book
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
};

export default ProfessionalFinder;