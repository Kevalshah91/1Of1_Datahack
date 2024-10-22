const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QuizResult = require('./models/QuizResult');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const MONGODB_URI = '';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Existing route for saving quiz results
app.post('/quiz-result', async (req, res) => {
    try {
        // Validate incoming data
        const {
            userId,
            questionsAttempted,
            totalTime,
            avgTimePerQuestion,
            score,
            topic,
            timestamp
        } = req.body;

        // Create new quiz result
        const quizResult = new QuizResult({
            userId,
            questionsAttempted,
            totalTime,
            avgTimePerQuestion,
            score,
            topic,
            timestamp: timestamp || new Date()
        });

        // Save to database
        await quizResult.save();

        res.status(201).json({ 
            message: 'Quiz result saved successfully',
            quizResult 
        });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(400).json({ 
            message: 'Error saving quiz result', 
            error: error.message 
        });
    }
});

// New route to get all quiz results for the graph
app.get('/quiz-results', async (req, res) => {
    try {
        const results = await QuizResult.find()
            .sort({ timestamp: -1 }) // Sort by newest first
            .limit(50); // Limit to last 50 results for performance
        res.json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ 
            message: 'Error fetching quiz results', 
            error: error.message 
        });
    }
});

// New route to get quiz results by user ID
app.get('/quiz-results/:userId', async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.params.userId })
            .sort({ timestamp: -1 });
        res.json(results);
    } catch (error) {
        console.error('Error fetching user quiz results:', error);
        res.status(500).json({ 
            message: 'Error fetching user quiz results', 
            error: error.message 
        });
    }
});

// New route to get aggregated quiz statistics
app.get('/quiz-stats', async (req, res) => {
    try {
        const stats = await QuizResult.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$score' },
                    avgQuestionsAttempted: { $avg: '$questionsAttempted' },
                    avgTimePerQuestion: { $avg: '$avgTimePerQuestion' },
                    totalQuizzes: { $sum: 1 },
                    topicDistribution: {
                        $push: {
                            topic: '$topic',
                            score: '$score'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    avgScore: { $round: ['$avgScore', 2] },
                    avgQuestionsAttempted: { $round: ['$avgQuestionsAttempted', 2] },
                    avgTimePerQuestion: { $round: ['$avgTimePerQuestion', 2] },
                    totalQuizzes: 1,
                    topicDistribution: 1
                }
            }
        ]);

        res.json(stats[0] || {
            avgScore: 0,
            avgQuestionsAttempted: 0,
            avgTimePerQuestion: 0,
            totalQuizzes: 0,
            topicDistribution: []
        });
    } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        res.status(500).json({ 
            message: 'Error fetching quiz statistics', 
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: err.message 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});