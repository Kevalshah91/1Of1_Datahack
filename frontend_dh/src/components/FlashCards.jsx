import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dummyFlashcards = [
  { id: 1, question: 'who', answer: 'The subject or object of a sentence' },
  { id: 2, question: 'what', answer: 'The object or action in a sentence' },
  { id: 3, question: 'where', answer: 'The location or place' },
  { id: 4, question: 'when', answer: 'The time or occasion' },
  { id: 5, question: 'why', answer: 'The reason or purpose' },
];

const FlashCards = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(0);
  const [stillLearning, setStillLearning] = useState(0);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < dummyFlashcards.length - 1) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <style jsx>{`
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 250px;
          perspective: 1000px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }
        .flip-card-front {
          background-color: #f7fafc;
        }
        .flip-card-back {
          background-color: #edf2f7;
          transform: rotateY(180deg);
        }
      `}</style>
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="text-orange-500">{stillLearning} Still learning</div>
          <div className="text-green-500">{knownCards} Know</div>
        </div>
        
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className="text-2xl font-bold">
                {dummyFlashcards[currentCardIndex].question}
              </div>
            </div>
            <div className="flip-card-back">
              <div className="text-xl">
                {dummyFlashcards[currentCardIndex].answer}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handlePrev} className="p-2 bg-gray-200 rounded-full" disabled={currentCardIndex === 0}>
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-2 bg-gray-200 rounded-full" disabled={currentCardIndex === dummyFlashcards.length - 1}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handleStillLearning} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Still learning</button>
          <button onClick={handleKnown} className="px-4 py-2 bg-green-500 text-white rounded-lg">Know</button>
        </div>

        <div className="mt-4 text-center text-sm">
          <span className="mr-2">⌨️ Shortcut</span>
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> or click on the card to flip
        </div>
      </div>
    </div>
  );
};

export default FlashCards;