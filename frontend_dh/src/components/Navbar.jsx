import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaQuestionCircle, FaBookOpen, FaUserCircle, FaChartBar, FaStickyNote, FaLayerGroup, FaVideo, FaImage } from 'react-icons/fa';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';
import { auth } from '../firebaseConfig'; // Assume this is already set up

const NavLink = ({ to, icon: Icon, children }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      to={to} 
      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-semibold transition duration-300"
    >
      <Icon className="text-xl" />
      <span>{children}</span>
    </Link>
  </motion.div>
);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md py-4 px-6 
        ${isScrolled ? 'shadow-lg' : ''}
        transition-all duration-300 ease-in-out border-b-4 border-purple-600`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center"
          >
            <FaBookOpen className="text-white text-xl" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            1of1
          </span>
        </Link>

        {/* Links */}
        <div className="space-x-4 flex items-center">
          <NavLink to="/" icon={FaHome}>Home</NavLink>
          <NavLink to="/quiz" icon={FaQuestionCircle}>Quiz</NavLink>
          <NavLink to="/course" icon={FaBookOpen}>Courses</NavLink>
          <NavLink to="/canvas" icon={FaLayerGroup}>Canvas</NavLink>
          <NavLink to="/cards" icon={BsFillCreditCard2FrontFill}>Flash Cards</NavLink>
          <NavLink to="/sticky" icon={FaStickyNote}>Sticky Notes</NavLink>
          <NavLink to="/dashboard" icon={FaChartBar}>Dashboard</NavLink>
          <NavLink to="/video" icon={FaVideo}>Video</NavLink>
          <NavLink to="/image" icon={FaImage}>Image</NavLink>



          {user ? (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-md"
            >
              <img 
                src={user.photoURL || '/default-avatar.png'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="font-semibold">{user.displayName}</span>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition duration-300 flex items-center space-x-2 shadow-md"
              >
                <FaUserCircle className="text-xl" />
                <span>Login</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;