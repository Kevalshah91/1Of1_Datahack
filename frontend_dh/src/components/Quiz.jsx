import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const Quiz = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    setFile(acceptedFile);
    uploadAndInitialize(acceptedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const uploadAndInitialize = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const filePath = uploadResponse.data.file_path;

      await axios.post('http://localhost:5000/initialize', { pdf_path: filePath });
      fetchQuestion();
    } catch (error) {
      console.error('Error uploading and initializing:', error);
      alert('Error uploading and initializing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/question');
      setQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/answer', { answer });
      setFeedback(response.data.correct);
      setAnswer('');
      fetchQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/suggestions');
      setSuggestions(response.data.suggestions);
      setScore(response.data.score);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    if (feedback !== null) {
      const timer = setTimeout(() => {
        setFeedback(null);
        fetchSuggestions();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">Quiz Platform</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {!file ? (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-purple-300 rounded-lg p-12 text-center cursor-pointer hover:bg-purple-50 transition duration-300"
            >
              <input {...getInputProps()} />
              <FaUpload className="text-purple-500 text-5xl mx-auto mb-4" />
              <p className="text-lg text-purple-700">
                {isDragActive ? "Drop the PDF here" : "Drag 'n' drop a PDF here, or click to select one"}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8"
            >
              {loading ? (
                <div className="text-center">
                  <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
                  <p className="text-lg text-purple-700">Initializing quiz...</p>
                </div>
              ) : question ? (
                <>
                  <h2 className="text-2xl font-semibold text-purple-800 mb-6">{question.question}</h2>
                  {question.type === 'mcq' ? (
                    <div className="space-y-3">
                      {question.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setAnswer(option)}
                          className={`w-full text-left p-3 rounded-md transition duration-300 ${
                            answer === option
                              ? 'bg-purple-200 text-purple-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-purple-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your answer..."
                    />
                  )}
                  <button
                    onClick={submitAnswer}
                    className="mt-6 w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-300"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <p className="text-lg text-gray-600">Loading question...</p>
              )}
              {feedback !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-6 p-4 rounded-md ${
                    feedback ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {feedback ? (
                    <FaCheck className="inline-block mr-2" />
                  ) : (
                    <FaTimes className="inline-block mr-2" />
                  )}
                  {feedback ? 'Correct!' : 'Incorrect. Try again!'}
                </motion.div>
              )}
              {suggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 bg-purple-50 p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">Suggestions for Improvement</h3>
                  <p className="text-gray-700">{suggestions}</p>
                  <p className="mt-4 font-semibold text-purple-700">Current Score: {score}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;