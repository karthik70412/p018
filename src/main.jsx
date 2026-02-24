import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all core components
import ProfessionalFinder from './ProfessionalFinder.jsx'; 
import SignIn from './pages/SignIn.jsx'; 
import Header from './components/Header.jsx'; 
import JoinProfessional from './pages/JoinProfessional.jsx'; 
import ProfessionalDetail from './pages/ProfessionalDetail.jsx'; 
import FavoritesPage from './pages/FavoritesPage.jsx'; 
import HistoryPage from './pages/HistoryPage.jsx'; 
import SupportPage from './pages/SupportPage.jsx'; 

// 🚀 NEW DASHBOARD AND CHAT MOCK COMPONENTS
import DashboardPage from './pages/DashboardPage.jsx';
import ChatMockPage from './pages/ChatMockPage.jsx';
import Footer from './components/Footer.jsx';

import './index.css'; 

// IMPORTANT: Define the base path for React Router
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Header />
      
      {/* Main content area */}
      <div className="main-app-container">
        <Routes>
          {/* Core Routes */}
          <Route path="/" element={<ProfessionalFinder />} /> 
          <Route path="/professional/:id" element={<ProfessionalDetail />} /> 
          
          {/* User Feature Routes */}
          <Route path="/favorites" element={<FavoritesPage />} /> 
          <Route path="/history" element={<HistoryPage />} /> 
          
          {/* Account Routes */}
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/join" element={<JoinProfessional />} />
          <Route path="/support" element={<SupportPage />} /> 
          
          {/* Advanced Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat/:proName" element={<ChatMockPage />} />
          
        </Routes>
      </div>
      {/* FEATURE: Footer Component */}
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
);