// src/data.js

// Initial Static Data (Mock database - Indian names and Rupees)
export const staticProfessionalsData = [
  { id: 1, name: "Rohan Sharma", profession: "Plumber", rating: 4.8, rate: 500, desc: "Certified and insured plumber with 10+ years experience in residential repairs.", image: "https://images.unsplash.com/photo-1549045337-ee4795e1e5e6?w=400&auto=format&fit=crop" },
  { id: 2, name: "Priya Patel", profession: "Web Developer", rating: 4.5, rate: 800, desc: "Specializes in React, modern front-end frameworks, and responsive design.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9d91?w=400&auto-format&fit=crop" },
  { id: 3, name: "Arjun Singh", profession: "Electrician", rating: 4.9, rate: 650, desc: "Licensed master electrician for commercial and residential wiring and fixes.", image: "https://images.unsplash.com/photo-1581092651631-f12745300b65?w=400&auto-format&fit=crop" },
  { id: 4, name: "Meera Das", profession: "Photographer", rating: 4.6, rate: 1200, desc: "Experienced in wedding, portrait, and commercial photography with fast turnaround.", image: "https://images.unsplash.com/photo-1502982899975-ad9924921357?w=400&auto-format&fit=crop" },
  { id: 5, name: "Kiran Rao", profession: "Plumber", rating: 4.1, rate: 450, desc: "Expert in leak detection and bathroom remodels. Reliable and clean service.", image: "https://images.unsplash.com/photo-1563854898150-1372d89b1418?w=400&auto-format&fit=crop" },
  { id: 6, name: "Sneha Varma", profession: "Web Developer", rating: 4.7, rate: 950, desc: "Full-stack developer with expertise in Node.js and MongoDB.", image: "https://images.unsplash.com/photo-1504868584819-5991c0157404?w=400&auto-format&fit=crop" },
  { id: 7, name: "Jai Kumar", profession: "Electrician", rating: 4.3, rate: 550, desc: "Residential electrical panel upgrades and smart home installations.", image: "https://images.unsplash.com/photo-1582234057973-19e48f1f7d1a?w=400&auto-format&fit=crop" },
  { id: 8, name: "Tanya Iyer", profession: "Photographer", rating: 5.0, rate: 1500, desc: "Highly rated commercial photographer specializing in product and brand imagery.", image: "https://images.unsplash.com/photo-1510100764720-6d45903b41e8?w=400&auto-format&fit=crop" },
  
  // 👈 NEW PROFESSIONS ADDED
  { id: 9, name: "Gaurav Soni", profession: "Appliance Technician", rating: 4.4, rate: 400, desc: "Specializes in troubleshooting and repairing all major home appliances (AC, Fridge, etc.).", image: "https://images.unsplash.com/photo-1541888941014-cb9250007542?w=400&auto-format&fit=crop" },
  { id: 10, name: "Sonia Kapoor", profession: "Graphic Designer", rating: 4.7, rate: 1100, desc: "Expert in brand identity, logo design, and social media graphics. Remote service available.", image: "https://images.unsplash.com/photo-1581291518635-c454e9545468?w=400&auto-format&fit=crop" },
  { id: 11, name: "Rajesh Deep", profession: "Deep Cleaner", rating: 4.9, rate: 700, desc: "Specialist in intensive house deep cleaning, sanitization, and post-construction cleanup.", image: "https://images.unsplash.com/photo-1581577717466-9e90a6134b22?w=400&auto=format&fit=crop" },
  { id: 12, name: "Vikram Nanda", profession: "Car Mechanic", rating: 4.6, rate: 850, desc: "Doorstep mechanic for quick services, oil changes, and minor engine trouble.", image: "https://images.unsplash.com/photo-1584067982245-c49b65d1d6a9?w=400&auto-format&fit=crop" },
];

// Function to load data (combines static data with localStorage additions)
export function getAllProfessionals() {
    if (typeof window === 'undefined') {
        return staticProfessionalsData;
    }
    const savedData = localStorage.getItem('newProfessionals');
    const newProfessionals = savedData ? JSON.parse(savedData) : [];
    
    return [...staticProfessionalsData, ...newProfessionals];
}