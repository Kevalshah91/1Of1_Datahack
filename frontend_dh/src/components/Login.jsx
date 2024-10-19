import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import logo from "../assets/logo.svg";
import { FaGoogle, FaEnvelope, FaLock, FaUserGraduate, FaBookReader } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);
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
      navigate("/");
    } catch (error) {
      console.error("Email/Password auth error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans">
      <div className="hidden lg:flex w-1/2 bg-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-500 opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 space-y-8">
          <img src={logo} alt="Logo" className="w-[30vw] h-[60vh] mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold text-purple-800 text-center leading-tight">
            Empower Your Learning Journey
          </h1>
          <p className="text-xl text-purple-700 text-center max-w-md">
            Join our innovative platform and unlock a world of knowledge at your fingertips.
          </p>
          <div className="flex space-x-4">
            <FaBookReader className="text-purple-600 text-5xl" />
            <FaEnvelope className="text-purple-600 text-5xl" />
            <FaLock className="text-purple-600 text-5xl" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-200 to-transparent"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-700">
              {isSignup ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-500 mt-2 italic">
              {isSignup ? "Start your learning adventure" : "Continue your education journey"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-purple-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-purple-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 rounded-lg py-2 px-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors duration-300"
          >
            <FaGoogle className="text-red-500" />
            <span>Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "New to our platform?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-1 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;