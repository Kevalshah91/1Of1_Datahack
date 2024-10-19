import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import logo from '../assets/logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Email/Password auth error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Left side: GTA-style backdrop */}
      <div className="hidden lg:flex w-1/2 bg-[url('path/to/gta-style-background.jpg')] bg-cover bg-center">
        <div className="w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
          <div className="max-w-md text-center p-8">
            <img src={logo} alt="Logo" className="w-[30vw] h-auto mb-6 mx-auto" />
            <h1 className="text-6xl font-extrabold mb-4 text-yellow-500 uppercase tracking-wider">
              Enter the Underworld
            </h1>
            <p className="text-xl leading-relaxed text-gray-300">
              Sign in to access your empire. The streets are waiting for their king.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-10 bg-white border-2 border-yellow-500 rounded-lg shadow-lg">


          <h2 className="text-4xl font-bold mb-6 text-center text-yellow-500 uppercase">
            {isSignup ? 'Create Your Legend' : 'Welcome Back, Boss'}
          </h2>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-white placeholder-gray-400 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 text-white placeholder-gray-400 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-3 font-bold uppercase tracking-wider hover:bg-yellow-600 transition duration-300"
            >
              {isSignup ? 'Start Your Empire' : 'Enter the Game'}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleAuth}
              className="w-full bg-red-600 text-white py-3 px-4 font-bold uppercase tracking-wider hover:bg-red-700 transition duration-300 flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="mt-8 text-center text-gray-400">
            {isSignup ? 'Already running the streets?' : "New to the game?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-1 text-yellow-500 hover:text-yellow-600 transition duration-300 uppercase font-bold"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;