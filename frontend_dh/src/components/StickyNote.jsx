import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
const StickyNote = () => {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stickyNotes, setStickyNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const stickyColors = [
    'bg-gradient-to-br from-yellow-200 to-yellow-100',
    'bg-gradient-to-br from-pink-200 to-pink-100',
    'bg-gradient-to-br from-green-200 to-green-100',
    'bg-gradient-to-br from-blue-200 to-blue-100',
    'bg-gradient-to-br from-purple-200 to-purple-100',
    'bg-gradient-to-br from-orange-200 to-orange-100'
  ];

  const generateSummary = async () => {
    if (content.trim() === '') {
      setError('Please enter some content.');
      return;
    }

    setIsLoading(true);
    setError('');

    const prompt = `Summarize the following text in 10 to 20 words: "${content}"`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setSummary(text);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
    }

    setIsLoading(false);
  };

  const addStickyNote = () => {
    if (summary) {
      const newNote = {
        id: Date.now(),
        content: summary,
        color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
        position: { x: Math.random() * 60, y: Math.random() * 60 }
      };
      setStickyNotes([...stickyNotes, newNote]);
      setContent('');
      setSummary('');
    }
  };

  const handleMouseDown = (e, note) => {
    setActiveNote(note);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!activeNote) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    setStickyNotes(notes =>
      notes.map(n =>
        n.id === activeNote.id
          ? { ...n, position: { x: n.position.x + dx / 5, y: n.position.y + dy / 5 } }
          : n
      )
    );

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setActiveNote(null);
  };

  const downloadAsImage = async (noteId) => {
    const element = document.getElementById(`sticky-note-${noteId}`);
    if (element) {
      const canvas = await html2canvas(element);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `sticky-note-${noteId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (content.trim() !== '') {
      const debounce = setTimeout(() => {
        generateSummary();
      }, 1000);

      return () => clearTimeout(debounce);
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-12 tracking-tight">
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Input */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content here (max 200 words)"
                className="w-full h-48 p-4 mb-4 border-2 border-indigo-200 rounded-xl shadow-inner resize-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mb-4">
                Words: {content.trim().split(/\s+/).length}/200
              </p>
              {error && <p className="text-red-500 mb-4 animate-pulse">{error}</p>}
              <button
                onClick={addStickyNote}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading || !summary}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Add Sticky Note'}
              </button>
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-[600px] overflow-hidden relative transform hover:scale-105 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-indigo-800">Your Sticky Notes</h2>
              <div 
                className="relative h-full overflow-auto bg-gray-100 rounded-xl p-4"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {stickyNotes.map((note) => (
                  <div
                    key={note.id}
                    id={`sticky-note-${note.id}`}
                    className={`absolute w-48 p-4 rounded-xl shadow-lg transform transition-all duration-300 cursor-move ${note.color}`}
                    style={{
                      top: `${note.position.y}%`,
                      left: `${note.position.x}%`,
                      zIndex: activeNote && activeNote.id === note.id ? 10 : 1,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, note)}
                  >
                    <p className="text-sm font-medium mb-2">{note.content}</p>
                    <button
                      onClick={() => downloadAsImage(note.id)}
                      className="mt-2 bg-white text-indigo-600 px-3 py-1 rounded-full text-xs hover:bg-indigo-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNote;