const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const connectDB = require('./config/db');

// Import routes
const clanRoutes = require('./routes/clan');
const paymentRoutes = require('./routes/payment');
const donationRoutes = require('./routes/donation');
const smsRoutes = require('./routes/sms');
const commentRoutes = require('./routes/comment');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5176', // your frontend
}));

app.use(express.json()); // Parse JSON bodies

// Mount routes
app.use('/api/clans', clanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/comments', commentRoutes); // added comments route

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
