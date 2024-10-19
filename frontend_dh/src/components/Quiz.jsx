import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

const Quiz = () => {
    const [user, authLoading, authError] = useAuthState(auth);
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [suggestions, setSuggestions] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [quizStats, setQuizStats] = useState({
        questionsAttempted: 0,
        totalTime: 0,
        avgTimePerQuestion: 0,
    });
    const [topic, setTopic] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    setFile(acceptedFile);
    uploadAndInitialize(acceptedFile);
    showToast('File uploaded successfully! Preparing your quiz...');
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
      setQuizStarted(true);
      setQuestionStartTime(Date.now());
      fetchQuestion();
    } catch (error) {
      showToast('Error uploading file. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/question');
      setQuestion(response.data);
      setQuestionStartTime(Date.now());
    } catch (error) {
      showToast('Error fetching question', 'error');
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      showToast('Please provide an answer', 'warning');
      return;
    }

    const endTime = Date.now();
    const timeSpent = (endTime - questionStartTime) / 1000; // Convert to seconds

    try {
      const response = await axios.post('http://localhost:5000/answer', { answer });
      setFeedback(response.data.correct);
      showToast(
        response.data.correct ? 'Correct answer!' : 'Incorrect answer',
        response.data.correct ? 'success' : 'error'
      );
      
      // Update quiz statistics
      setQuizStats(prevStats => ({
        questionsAttempted: prevStats.questionsAttempted + 1,
        totalTime: prevStats.totalTime + timeSpent,
        avgTimePerQuestion: (prevStats.totalTime + timeSpent) / (prevStats.questionsAttempted + 1)
      }));

      setAnswer('');
      fetchQuestion();
    } catch (error) {
      showToast('Error submitting answer', 'error');
    }
  };

  const endQuiz = async () => {
    try {
        setQuizEnded(true);
        
        // Ensure all required fields are numbers and properly formatted
        const finalStats = {
            userId: user?.uid || 'anonymous',
            questionsAttempted: parseInt(quizStats.questionsAttempted) || 0,
            totalTime: parseFloat(quizStats.totalTime) || 0,
            avgTimePerQuestion: parseFloat(quizStats.avgTimePerQuestion) || 0,
            score: parseInt(score) || 0,
            topic: topic.trim() || 'Untitled Quiz',
            timestamp: new Date().toISOString()
        };

        // Validate the data before sending
        if (!finalStats.userId || 
            finalStats.questionsAttempted < 0 || 
            finalStats.totalTime < 0 || 
            finalStats.avgTimePerQuestion < 0 || 
            finalStats.score < 0 || 
            !finalStats.topic) {
            throw new Error('Invalid quiz data');
        }

        // Make sure to use the full URL and proper headers
        const response = await axios.post('http://localhost:3000/quiz-result', finalStats, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data) {
            showToast('Quiz results saved successfully!', 'success');
        }
    } catch (error) {
        console.error('Error saving quiz results:', error);
        showToast(
            error.response?.data?.message || 'Error saving quiz results. Please try again.',
            'error'
        );
    }
};
  

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/suggestions');
      setSuggestions(response.data.suggestions);
      setScore(response.data.score);
    } catch (error) {
      showToast('Error fetching suggestions', 'error');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all transform duration-300 ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Interactive Quiz
        </h1>

        {/* User Info */}
        {user && (
          <div className="text-center mb-4 text-gray-700 font-extrabold">
            Welcome, {user.email}!
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!file ? (
            <div
              {...getRootProps()}
              className={`
                border-3 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}
              `}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg text-gray-700 font-medium">
                {isDragActive ? "Drop your PDF here!" : "Drag & drop your PDF here or click to browse"}
              </p>
              <p className="text-sm text-gray-500 mt-2">Supported format: PDF</p>
            </div>
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin text-4xl mb-4">⚡</div>
                  <p className="text-lg text-gray-700">Preparing your quiz...</p>
                </div>
              ) : (
                <>
                  {/* Quiz Statistics */}
                  {quizStarted && !quizEnded && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold text-purple-800 mb-2">Quiz Progress</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Questions Attempted</p>
                          <p className="font-medium">{quizStats.questionsAttempted}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Time</p>
                          <p className="font-medium">{Math.round(quizStats.totalTime)}s</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Time/Question</p>
                          <p className="font-medium">{Math.round(quizStats.avgTimePerQuestion)}s</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {question && (
                    <>
                      <div className="bg-purple-50 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold text-purple-800 mb-2">Question:</h2>
                        <p className="text-gray-700">{question.question}</p>
                      </div>

                      {question.type === 'mcq' ? (
                        <div className="space-y-3">
                          {question.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => setAnswer(option)}
                              className={`
                                w-full text-left p-4 rounded-lg transition-all duration-300
                                ${answer === option 
                                  ? 'bg-purple-100 border-2 border-purple-400 text-purple-800' 
                                  : 'bg-gray-50 border-2 border-transparent hover:bg-purple-50 hover:border-purple-300'
                                }
                              `}
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
                          placeholder="Type your answer here..."
                          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                        />
                      )}

                      <div className="flex gap-4">
                        <button
                          onClick={submitAnswer}
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Submit Answer
                        </button>
                        
                        <button
                          onClick={endQuiz}
                          className="py-4 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
                        >
                          End Quiz
                        </button>
                      </div>
                    </>
                  )}

                  {/* Feedback Animation */}
                  {feedback !== null && (
                    <div className={`
                      p-4 rounded-lg text-center font-medium
                      ${feedback ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      transform transition-all duration-300
                    `}>
                      {feedback ? '✅ Correct!' : '❌ Incorrect. Try again!'}
                    </div>
                  )}

                  {/* Quiz Results */}
                  {quizEnded && (
                    <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-purple-800 mb-4">
                        Quiz Results
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-700 mb-2">Final Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-600">Total Questions</p>
                              <p className="font-medium">{quizStats.questionsAttempted}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Final Score</p>
                              <p className="font-medium">{score}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Time</p>
                              <p className="font-medium">{Math.round(quizStats.totalTime)}s</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Avg Time/Question</p>
                              <p className="font-medium">{Math.round(quizStats.avgTimePerQuestion)}s</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Learning Insights Section */}
                  {suggestions && (
                    <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-purple-800 mb-4">
                        🎯 Learning Insights
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-700 mb-2">
                            Key Takeaways
                          </h4>
                          <div className="prose text-gray-700" 
                            dangerouslySetInnerHTML={{ 
                              __html: suggestions.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                  .replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>')
                            }} 
                          />
                        </div>

                        <div className="bg-white/50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-700 mb-2">
                            📈 Progress Score
                          </h4>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="font-medium text-purple-800">{score}%</span>
                          </div>
                        </div>

                        {quizEnded && (
                          <div className="bg-white/50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-700 mb-2">
                              Want to try again?
                            </h4>
                            <button
                              onClick={() => {
                                setFile(null);
                                setQuestion(null);
                                setAnswer('');
                                setFeedback(null);
                                setSuggestions(null);
                                setScore(0);
                                setQuizStarted(false);
                                setQuizEnded(false);
                                setQuizStats({
                                  questionsAttempted: 0,
                                  totalTime: 0,
                                  avgTimePerQuestion: 0,
                                });
                                setTopic('');
                              }}
                              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                            >
                              Start New Quiz
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Topic Selection - Only show when quiz hasn't started */}
        {!quizStarted && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-3">
              Select Quiz Topic
            </h3>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the topic for this quiz"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        )}

        {/* Loading State for Authentication */}
        {authLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-lg text-gray-700">Loading...</p>
          </div>
        </div>
      )}

        {/* Authentication Error */}
        {authError && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
          Error: {authError.message}
        </div>
      )}
      </div>
    </div>
  );
};

export default Quiz;