const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  questionsAttempted: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
  avgTimePerQuestion: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;