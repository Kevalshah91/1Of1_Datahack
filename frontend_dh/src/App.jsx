import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CanvasBoard from './components/CanvasBoard';
import Login from './components/Login';
import Navbar from './components/Navbar'; // Import the Navbar component
import FlashCards from './components/FlashCards';
import StickyNote from './components/StickyNote';
import HomePage from './components/HomePage';
import Quiz from './components/Quiz';
import Course from './components/Course';
import Video from './components/Video';
import Dashboard from './components/Dashboard';
import Image from './components/Image';
// import Diagram from './components/Diagram';

const App = () => {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Render Navbar only if not on the login page */}
      {location.pathname !== '/login' && <Navbar />}

      <Routes>
        <Route path="/canvas" element={<CanvasBoard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/course" element={<Course />} />


        <Route path="/login" element={<Login />} />
        <Route path="/cards" element={<FlashCards/>} />
        <Route path="/sticky" element={<StickyNote/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/video" element={<Video/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/diagram" element={<Diagram/>} /> */}
        <Route path="/image" element={<Image/>} />







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
