import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all necessary components and styles
import ProfessionalFinder from './ProfessionalFinder.jsx'; 
import SignIn from './pages/SignIn.jsx'; 
import Header from './components/Header.jsx'; 
import JoinProfessional from './pages/JoinProfessional.jsx'; 
import ProfessionalDetail from './pages/ProfessionalDetail.jsx'; 
import FavoritesPage from './pages/FavoritesPage.jsx'; 
import HistoryPage from './pages/HistoryPage.jsx'; // 👈 Must be imported!
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
          {/* Core Routes */}
          <Route path="/" element={<ProfessionalFinder />} /> 
          <Route path="/professional/:id" element={<ProfessionalDetail />} /> 
          
          {/* Account Routes */}
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/join" element={<JoinProfessional />} />
          
          {/* User Feature Routes */}
          <Route path="/favorites" element={<FavoritesPage />} /> 
          <Route path="/history" element={<HistoryPage />} /> 
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