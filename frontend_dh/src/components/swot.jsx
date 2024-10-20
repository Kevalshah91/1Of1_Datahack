import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaChartLine, 
  FaExclamationTriangle,
  FaSpinner,
  FaTimes,
  FaChevronLeft
} from "react-icons/fa";

const SWOT_CATEGORIES = {
  s: { 
    name: "Strengths",
    bgColor: "bg-blue-100",
    hoverColor: "hover:bg-blue-200",
    textColor: "text-blue-600",
    icon: <FaChartLine className="w-6 h-6 text-blue-600" />
  },
  w: { 
    name: "Weaknesses",
    bgColor: "bg-yellow-100",
    hoverColor: "hover:bg-yellow-200",
    textColor: "text-yellow-600",
    icon: <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
  },
  o: { 
    name: "Opportunities",
    bgColor: "bg-green-100",
    hoverColor: "hover:bg-green-200",
    textColor: "text-green-600",
    icon: <FaChartLine className="w-6 h-6 text-green-600" />
  },
  t: { 
    name: "Threats",
    bgColor: "bg-red-100",
    hoverColor: "hover:bg-red-200",
    textColor: "text-red-600",
    icon: <FaExclamationTriangle className="w-6 h-6 text-red-600" />
  }
};

const SwotAnalysis = () => {
  const [expanded, setExpanded] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expanded]);

  const formatQuizData = (data) => {
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleDateString(),
      score: parseInt(item.score),
      questionsAttempted: parseInt(item.questionsAttempted),
      avgTimePerQuestion: parseFloat(item.avgTimePerQuestion).toFixed(2),
      totalTime: parseFloat(item.totalTime).toFixed(2)
    }));
  };

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/quiz-results');
      const formattedData = formatQuizData(response.data);
      setQuizData(formattedData);
      await generateSwotAnalysis(formattedData);
    } catch (err) {
      setError('Failed to fetch quiz data');
      console.error('Error fetching quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    const avgScore = data.reduce((acc, item) => acc + item.score, 0) / data.length;
    const avgTime = data.reduce((acc, item) => acc + parseFloat(item.totalTime), 0) / data.length;
    return {
      avgScore: avgScore.toFixed(2),
      totalQuizzes: data.length,
      avgTime: avgTime.toFixed(2)
    };
  };

  const createGeminiPrompt = (stats) => {
    return `
# Quiz Performance Analysis Request

## Statistical Overview
* Average Score: ${stats.avgScore}%
* Total Quizzes: ${stats.totalQuizzes}
* Average Time: ${stats.avgTime}s

## Quiz Result Schema
\`\`\`
{
  userId: String,
  questionsAttempted: Number,
  totalTime: Number,
  avgTimePerQuestion: Number,
  score: Number,
  topic: String,
  timestamp: Date
}
\`\`\`

## Analysis Requirements
Please provide a structured SWOT analysis with the following components:

### Strengths
- List 3-4 key performance strengths
- Focus on quantifiable achievements
- Highlight positive patterns

### Weaknesses
- Identify 3-4 improvement areas
- Consider both performance and time metrics
- Note any concerning patterns

### Opportunities
- Suggest 3-4 growth areas
- Include specific actionable recommendations
- Consider potential optimization strategies

### Threats
- List 3-4 potential risks
- Include both internal and external factors
- Consider long-term sustainability

Note: Please format each point as a clear, actionable bullet point. Use Markdown formatting to make the response more readable.`;
  };

  const generateSwotAnalysis = async (data) => {
    try {
      const stats = calculateStatistics(data);
      const prompt = createGeminiPrompt(stats);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const parsedAnalysis = parseSwotResponse(response.text());
      setAnalysis(parsedAnalysis);
    } catch (err) {
      console.error('Error generating SWOT analysis:', err);
      setAnalysis(generateBasicAnalysis(data));
    }
  };

  const parseSwotResponse = (text) => {
    const sections = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };

    let currentSection = null;
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim().toLowerCase();
      
      if (trimmedLine.includes('strengths')) currentSection = 'strengths';
      else if (trimmedLine.includes('weaknesses')) currentSection = 'weaknesses';
      else if (trimmedLine.includes('opportunities')) currentSection = 'opportunities';
      else if (trimmedLine.includes('threats')) currentSection = 'threats';
      else if ((trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) && currentSection) {
        const cleanedPoint = line.replace(/^[-•]\s*/, '').trim();
        if (cleanedPoint) sections[currentSection].push(cleanedPoint);
      }
    });

    return sections;
  };

  const generateBasicAnalysis = (data) => {
    const stats = calculateStatistics(data);
    
    return {
      strengths: [
        `Average score of ${stats.avgScore}% demonstrates strong performance`,
        `Consistent participation with ${stats.totalQuizzes} completed quizzes`,
        `Efficient completion time averaging ${stats.avgTime} seconds`
      ],
      weaknesses: [
        "Performance consistency needs improvement",
        "Time management in complex topics requires attention",
        "Question completion rate could be optimized"
      ],
      opportunities: [
        "Potential for targeted practice in weak areas",
        "Room for time management optimization",
        "Possibility of implementing new study strategies"
      ],
      threats: [
        "Increasing quiz difficulty levels",
        "Time pressure impact on performance",
        "Maintaining consistent engagement"
      ]
    };
  };

  const Modal = ({ category, onClose, children }) => {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {category.icon}
                <h2 className="text-3xl font-bold">{category.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] prose prose-sm max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
        <FaExclamationTriangle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  const getAnalysisKey = (key) => {
    switch(key) {
      case 's': return 'strengths';
      case 'w': return 'weaknesses';
      case 'o': return 'opportunities';
      case 't': return 'threats';
      default: return '';
    }
  };

  const renderMarkdown = (content) => {
    return { __html: marked(content) };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-2 grid-rows-2 gap-6">
        {Object.entries(SWOT_CATEGORIES).map(([key, category]) => (
          <div
            key={key}
            onClick={() => setExpanded(key)}
            className={`
              rounded-xl p-6 cursor-pointer transition-all duration-300
              ${category.bgColor} ${category.hoverColor}
              transform hover:scale-105
            `}
          >
            <div className="flex items-center space-x-3">
              {category.icon}
              <h2 className="text-2xl font-bold">{category.name}</h2>
            </div>
            
            <div className="mt-4">
              <ul className="space-y-2">
                {analysis[getAnalysisKey(key)].slice(0, 2).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-2 h-2 mt-2 mr-3 rounded-full ${category.textColor}`} />
                    <span className="text-gray-700 line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
              {analysis[getAnalysisKey(key)].length > 2 && (
                <p className="mt-2 text-sm text-gray-500">Click to see more...</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <Modal 
          category={SWOT_CATEGORIES[expanded]} 
          onClose={() => setExpanded(null)}
        >
          <div 
            dangerouslySetInnerHTML={renderMarkdown(analysis[getAnalysisKey(expanded)].join('\n\n'))} 
          />
          
          <button
            onClick={() => setExpanded(null)}
            className="mt-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </button>
        </Modal>
      )}
    </div>
  );
};

export default SwotAnalysis;