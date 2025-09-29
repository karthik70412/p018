import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all necessary components and styles
import ProfessionalFinder from './ProfessionalFinder.jsx'; 
import SignIn from './pages/SignIn.jsx'; 
import Header from './components/Header.jsx'; 
import './index.css'; 

// IMPORTANT: Define the base path for React Router
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    // Pass the basename from Vite config to BrowserRouter
    <BrowserRouter basename={basename}>
      <Header />
      
      {/* Main content area */}
      <div className="main-app-container">
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

// Add a simple container style class to index.css
/* You can add this to your src/index.css */
/*
.main-app-container {
    min-height: calc(100vh - 60px); 
}
*/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
);