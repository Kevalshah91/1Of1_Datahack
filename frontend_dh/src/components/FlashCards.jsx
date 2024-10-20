import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import axios from 'axios';

const FlashCards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(0);
  const [stillLearning, setStillLearning] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        setIsFlipped(!isFlipped);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped]);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  // New function to fetch additional flashcards
  const fetchMoreFlashcards = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const newCards = [];
      // Fetch 5 new flashcards
      for (let i = 0; i < 5; i++) {
        const response = await axios.get('http://localhost:5010/flashcard');
        let newCard = response.data;
        if (typeof newCard === 'string') {
          try {
            newCard = JSON.parse(newCard);
          } catch (e) {
            newCard = {
              topic: 'Error parsing card',
              answer: 'Please try again'
            };
          }
        }
        newCards.push(newCard);
      }
      setFlashcards(prev => [...prev, ...newCards]);
    } catch (err) {
      console.error('Error fetching more flashcards:', err);
      setError('Error generating new flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  // Modified to check if we need more cards
  useEffect(() => {
    if (initialized && flashcards.length - currentCardIndex <= 2) {
      fetchMoreFlashcards();
    }
  }, [currentCardIndex, initialized, flashcards.length]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const uploadResponse = await axios.post('http://localhost:5010/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const initializeResponse = await axios.post('http://localhost:5010/initialize', {
        pdf_path: uploadResponse.data.file_path
      });

      let initialFlashcards = initializeResponse.data.initial_flashcards;
      
      if (typeof initialFlashcards === 'string') {
        try {
          initialFlashcards = JSON.parse(initialFlashcards);
        } catch (e) {
          console.error('Error parsing flashcards:', e);
        }
      }

      const formattedFlashcards = initialFlashcards.map(card => {
        if (typeof card === 'string') {
          try {
            return JSON.parse(card);
          } catch (e) {
            return {
              topic: 'Error parsing card',
              answer: 'Please try again'
            };
          }
        }
        return card;
      });
      
      setFlashcards(formattedFlashcards);
      setCurrentCardIndex(0);
      setKnownCards(0);
      setStillLearning(0);
      setInitialized(true);
    } catch (err) {
      console.error('Full error:', err);
      setError(err.response?.data?.error || 'Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleKnown = () => {
    setKnownCards(knownCards + 1);
    handleNext();
  };

  const handleStillLearning = () => {
    setStillLearning(stillLearning + 1);
    handleNext();
  };

  const getCurrentCard = () => {
    if (!flashcards.length) return { topic: 'No cards available', answer: 'Please upload a PDF' };
    const card = flashcards[currentCardIndex];
    if (!card) return { topic: 'Loading...', answer: 'Loading...' };
    return card;
  };

  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Upload PDF to Start</h2>
          <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Upload size={48} className="text-gray-500 mb-2" />
            <span className="text-sm text-gray-500">Click to upload PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {loading && <p className="text-center mt-4">Processing your document...</p>}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  const currentCard = getCurrentCard();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between mb-6">
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
            Still learning: {stillLearning}
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            Known: {knownCards}
          </div>
        </div>
        
        <div className="relative w-full h-[400px] cursor-pointer" onClick={handleFlip}>
          <div className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center [backface-visibility:hidden]">
              <div className="text-2xl font-bold text-center">
                {currentCard.topic}
              </div>
            </div>
            <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-8 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="text-xl text-center">
                {currentCard.answer}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-3 bg-white shadow-md rounded-full hover:bg-gray-50 disabled:opacity-50"
            disabled={currentCardIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-white shadow-md rounded-full hover:bg-gray-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={handleStillLearning}
            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Still learning
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Know
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4 text-center text-gray-600">
            Generating new flashcards...
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <span className="mr-2">⌨️ Shortcut:</span>
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> or click the card to flip
        </div>
      </div>
    </div>
  );
};

export default FlashCards;