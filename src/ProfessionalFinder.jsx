import React, { useState, useMemo } from 'react';
import { getAllProfessionals } from './data.js';
import PopularCategories from './components/PopularCategories.jsx'; 

const ProfessionalFinder = () => {
    // --- STATE MANAGEMENT ---
    const [allProfessionals, setAllProfessionals] = useState(getAllProfessionals());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [sortByRating, setSortByRating] = useState(false);
    
    // 👈 NEW: State for Modal visibility and selected professional details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPro, setSelectedPro] = useState(null);

    // Function to get current user details from localStorage
    const getCurrentUser = () => {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    };
    const currentUser = getCurrentUser();

    // --- BOOKING HANDLERS ---
    const handleHireClick = (pro) => {
        if (!currentUser || !currentUser.isLoggedIn) {
            alert("Please Sign In / Register first to hire a professional.");
            return;
        }
        setSelectedPro(pro);
        setIsModalOpen(true);
    };

    const handleConfirmBooking = () => {
        if (!selectedPro) return;

        // --- PAYMENT SIMULATION ---
        // In a real app, payment gateway integration would go here.
        alert(`Payment of ₹${selectedPro.rate} is simulated successfully!`);

        // --- EMAIL CONFIRMATION SIMULATION ---
        alert(
            `Booking Confirmed! A confirmation mail has been sent to your registered email (${currentUser.email ? currentUser.email : 'client@example.com'}).` + 
            `\n\nBooking Details:\n` +
            `Professional: ${selectedPro.name} (${selectedPro.profession})\n` +
            `Rate: ₹${selectedPro.rate}/hr\n` +
            `Booking Date: Today`
        );
        
        setIsModalOpen(false);
        setSelectedPro(null);
    };

    // --- FILTERING LOGIC (Unchanged) ---
    const filteredAndSortedProfessionals = useMemo(() => {
        let list = [...allProfessionals]; 
        
        list = list.filter(p => {
            const matchesSearch = 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.profession.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !selectedProfession || p.profession === selectedProfession;
            return matchesSearch && matchesFilter;
        });

        if (sortByRating) {
            list.sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [searchTerm, selectedProfession, sortByRating, allProfessionals]);

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

            {/* Controls Section (Unchanged) */}
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
                    <option value="Appliance Technician">Appliance Technician</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Deep Cleaner">Deep Cleaner</option>
                    <option value="Car Mechanic">Car Mechanic</option>
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
                            
                            <img src={p.image} alt={p.name} className="card-image" loading="lazy"/>

                            <div className="card-content">
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>{p.name}</h3>
                                <p style={{ color: '#007bff', fontWeight: '600', marginBottom: '10px' }}>{p.profession}</p>
                                
                                <div className="card-details">
                                    <p style={{ margin: 0 }}>⭐ {p.rating}</p>
                                    <p style={{ margin: 0 }}>💰 ₹{p.rate}/hr</p> 
                                </div>
                                
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{p.desc}</p>
                                
                                <button 
                                    className="hire-btn"
                                    onClick={() => handleHireClick(p)} // 👈 Updated handler
                                >
                                    Hire Now
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* 👈 BOOKING CONFIRMATION MODAL */}
            {isModalOpen && selectedPro && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>Confirm Booking & Payment</h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>You are about to book this service for one hour.</p>

                        <div className="summary-box">
                            <p><strong>Professional:</strong> {selectedPro.name}</p>
                            <p><strong>Service:</strong> {selectedPro.profession}</p>
                            <p><strong>Hourly Rate:</strong> ₹{selectedPro.rate}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
                                Total Due (1 Hour Service): <span style={{ color: '#007bff' }}>₹{selectedPro.rate}</span>
                            </p>
                        </div>
                        
                        <div className="payment-details">
                            <input type="text" placeholder="Card Number (Simulated)" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                            <p style={{ color: 'red', fontSize: '12px' }}>*Payment is simulated. No real charges will be processed.*</p>
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
        </main>
    );
};

export default ProfessionalFinder;