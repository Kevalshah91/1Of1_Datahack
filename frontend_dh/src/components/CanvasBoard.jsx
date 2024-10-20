import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const CanvasBoard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    setAnalysisResult(null);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const analyzeDrawing = async () => {
    if (!canvasRef.current || !question) return;

    setIsAnalyzing(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      
      // Create FormData and append blob and prompt
      const formData = new FormData();
      formData.append('image', blob, 'drawing.png');
      formData.append('prompt', question);

      // Send request to backend
      const response = await axios.post('http://localhost:5030/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing drawing:', error);
      setAnalysisResult({ error: 'Failed to analyze drawing' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-300">
        <div className="mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your drawing prompt"
            className="w-full px-3 py-2 border rounded-md"
          />
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
              className={`px-4 py-2 ${isEraser ? 'bg-purple-400' : 'bg-purple-600'} text-white rounded-full hover:bg-purple-700`}
            >
              {isEraser ? 'Eraser' : 'Brush'}
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Clear
            </button>
            <button
              onClick={analyzeDrawing}
              disabled={isAnalyzing}
              className={`px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
            <p>Confidence: {analysisResult.confidence}</p>
            {analysisResult.error && <p className="text-red-500">{analysisResult.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasBoard;