import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CanvasBoard from './components/CanvasBoard';
import Login from './components/Login';
import Navbar from './components/Navbar'; // Import the Navbar component
import FlashCards from './components/FlashCards';
import StickyNote from './components/StickyNote';
import HomePage from './components/HomePage';

const App = () => {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Render Navbar only if not on the login page */}
      {location.pathname !== '/login' && <Navbar />}

      <Routes>
        <Route path="/canvas" element={<CanvasBoard />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cards" element={<FlashCards/>} />
        <Route path="/sticky" element={<StickyNote/>} />


      </Routes>
    </>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
