import React, { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { FaPencilAlt, FaEraser, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const questions = [
  "Draw a house",
  "Sketch a car",
  "Illustrate a tree",
  "Design a logo",
  "Create a landscape"
];

const CanvasBoard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = isEraser ? eraserWidth : brushWidth;
      contextRef.current = ctx;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? '#FFFFFF' : color;
      contextRef.current.lineWidth = isEraser ? eraserWidth : brushWidth;
    }
  }, [color, brushWidth, eraserWidth, isEraser]);

  const startDrawing = ({ nativeEvent }) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (contextRef.current && canvas) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        saveAs(blob, `drawing-${currentQuestionIndex + 1}.png`);
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      clearCanvas();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      clearCanvas();
    }
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <div className="p-4 bg-gray-100  flex flex-col items-center justify-center">
      <div className="bg-white p-2  shadow-lg rounded-lg  border border-gray-300">
        {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Canvas Drawing Board</h1>  */}
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
          >
            <FaChevronLeft className="mr-2" /> Previous
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{questions[currentQuestionIndex]}</h2>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
          >
            Next <FaChevronRight className="ml-2" />
          </button>
        </div>

        <div className="border-4 border-purple-600 rounded-lg overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-[80vw] h-[70vh] bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <label className="flex items-center space-x-2">
              <span className="text-gray-700">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isEraser}
                className="w-8 h-8 border rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center space-x-2">
              <span className="text-gray-700">{isEraser ? 'Eraser' : 'Brush'} Size:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={isEraser ? eraserWidth : brushWidth}
                onChange={(e) => isEraser ? setEraserWidth(Number(e.target.value)) : setBrushWidth(Number(e.target.value))}
                className="cursor-pointer"
              />
            </label>

            <button
              onClick={toggleEraser}
              className={`px-4 py-2 ${isEraser ? 'bg-purple-400' : 'bg-purple-600'} text-white rounded-full hover:bg-purple-700 flex items-center`}
            >
              {isEraser ? <FaEraser className="mr-2" /> : <FaPencilAlt className="mr-2" />}
              {isEraser ? 'Eraser' : 'Brush'}
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center"
            >
              <FaTrash className="mr-2" /> Clear
            </button>
            <button
              onClick={downloadCanvas}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center"
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasBoard;