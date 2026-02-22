import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import matchesRouter from './routes/matches';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Matches route
app.use('/api/matches', matchesRouter);

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.warn('MongoDB connection failed. The app will run without database connectivity.');
    console.warn('Error:', err.message);
  });

// Start server
app.listen(config.port, () => {
  console.log(`footballStAItsBoard backend server is running on port ${config.port}`);
});

export default app;
