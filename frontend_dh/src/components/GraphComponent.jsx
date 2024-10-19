import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Graph = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [selectedChart, setSelectedChart] = useState('line');
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#FF5733'];

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/quiz-results');
      // Format dates and ensure numbers are properly parsed
      const formattedData = response.data.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleDateString(),
        score: parseInt(item.score),
        questionsAttempted: parseInt(item.questionsAttempted),
        avgTimePerQuestion: parseFloat(item.avgTimePerQuestion).toFixed(2),
        totalTime: parseFloat(item.totalTime).toFixed(2)
      }));
      setQuizData(formattedData);
    } catch (err) {
      setError('Failed to fetch quiz data');
      console.error('Error fetching quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    // Group data by topic for pie chart
    if (selectedChart === 'pie') {
      const topicData = quizData.reduce((acc, item) => {
        acc[item.topic] = (acc[item.topic] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(topicData).map(([topic, count]) => ({
        name: topic,
        value: count
      }));
    }
    
    return quizData;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⚡</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Quiz Performance Analytics</h2>
        
        <div className="flex gap-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="score">Score</option>
            <option value="questionsAttempted">Questions Attempted</option>
            <option value="avgTimePerQuestion">Avg Time per Question</option>
            <option value="totalTime">Total Time</option>
          </select>

          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Topic Distribution</option>
          </select>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          {selectedChart === 'line' ? (
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : selectedChart === 'bar' ? (
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={getChartData()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm text-purple-800 font-medium">Average Score</h3>
          <p className="text-2xl font-bold text-purple-900">
            {(quizData.reduce((acc, item) => acc + item.score, 0) / quizData.length).toFixed(2)}%
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm text-purple-800 font-medium">Total Quizzes</h3>
          <p className="text-2xl font-bold text-purple-900">{quizData.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm text-purple-800 font-medium">Avg Questions/Quiz</h3>
          <p className="text-2xl font-bold text-purple-900">
            {(quizData.reduce((acc, item) => acc + item.questionsAttempted, 0) / quizData.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm text-purple-800 font-medium">Avg Time/Quiz</h3>
          <p className="text-2xl font-bold text-purple-900">
            {(quizData.reduce((acc, item) => acc + parseFloat(item.totalTime), 0) / quizData.length).toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default Graph;