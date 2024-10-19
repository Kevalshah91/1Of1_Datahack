import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const Video = () => {
  const [topic, setTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate_video', { topic });
      setVideoUrl(response.data.video_url);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-8 text-center">Video Generator</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter a topic for the video..."
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateVideo}
          disabled={loading || !topic}
          className={`w-full bg-purple-600 text-white px-6 py-3 rounded flex items-center justify-center ${
            loading || !topic ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          } transition duration-300`}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
          ) : (
            <>
              <FaPlay className="mr-2" />
              Generate Video
            </>
          )}
        </motion.button>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">{topic}</h2>
            <video controls className="w-full rounded-lg shadow-lg">
              <source src={`http://localhost:5000${videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Video;