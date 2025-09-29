import React, { useState, useMemo } from 'react';
import { professionalsData } from './data.js';

const ProfessionalFinder = () => {
    // STATE: Manage the user inputs (search term, filter) and sort status
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [sortByRating, setSortByRating] = useState(false);

    // LOGIC: Calculate the filtered and sorted list
    const filteredAndSortedProfessionals = useMemo(() => {
        let list = [...professionalsData]; 

        // Apply Search and Filter
        list = list.filter(p => {
            const matchesSearch = 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.profession.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !selectedProfession || p.profession === selectedProfession;
            return matchesSearch && matchesFilter;
        });

        // Apply Sort
        if (sortByRating) {
            list.sort((a, b) => b.rating - a.rating); // High to Low
        }

        return list;
    }, [searchTerm, selectedProfession, sortByRating]);

    // UI RENDER (JSX)
    return (
        <main className="main-content">
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Find & Hire the Right Professional</h1>
            
            {/* Controls Section */}
            <section className="controls-section">
                <input
                    type="text"
                    placeholder="Search by name or profession..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                >
                    <option value="">All Professions</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Photographer">Photographer</option>
                </select>

                <button
                    style={{ backgroundColor: sortByRating ? '#28a745' : '#ccc', color: sortByRating ? 'white' : '#333' }}
                    onClick={() => setSortByRating(!sortByRating)}
                >
                    {sortByRating ? 'Sorted: Rating High ↓' : 'Sort by Rating'}
                </button>
            </section>

            {/* Results Display Section */}
            <section className="results-grid">
                {filteredAndSortedProfessionals.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>
                        Sorry, no professionals match your criteria. Try adjusting your search.
                    </p>
                ) : (
                    filteredAndSortedProfessionals.map(p => (
                        <div key={p.id} className="professional-card">
                            
                            {/* Professional Image */}
                            <img 
                                src={p.image} 
                                alt={p.name} 
                                className="card-image" 
                                loading="lazy"
                            />

                            <div className="card-content">
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>{p.name}</h3>
                                <p style={{ color: '#007bff', fontWeight: '600', marginBottom: '10px' }}>{p.profession}</p>
                                
                                <div className="card-details">
                                    <p style={{ margin: 0 }}>⭐ {p.rating}</p>
                                    <p style={{ margin: 0 }}>💰 ${p.rate}/hr</p>
                                </div>
                                
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{p.desc}</p>
                                
                                <button 
                                    className="hire-btn"
                                    onClick={() => alert(`Hiring ${p.name}! (Prototype Action)`)}
                                >
                                    Hire Now
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
};

export default ProfessionalFinder;