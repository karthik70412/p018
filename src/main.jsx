// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all necessary components and styles
import ProfessionalFinder from './ProfessionalFinder.jsx'; 
import SignIn from './pages/SignIn.jsx'; 
import Header from './components/Header.jsx'; 
import './index.css'; // Imports your correctly configured Tailwind CSS

function App() {
  return (
    <BrowserRouter>
      {/* The Header component is outside the Routes so it appears on every page */}
      <Header />
      
      {/* Main content area */}
      <div className="min-h-screen">
        <Routes>
          {/* Main search and finder page */}
          <Route path="/" element={<ProfessionalFinder />} /> 
          
          {/* Sign-in page */}
          <Route path="/signin" element={<SignIn />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
);