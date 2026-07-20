import express from 'express';
import cors from 'cors';
import gamesRoutes from './routes/games.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulated slow network connection middleware for connectivity testing
app.use(async (req, res, next) => {
  if (req.headers['x-simulate-delay'] === 'true' || req.query.simulatedDelay === 'true') {
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  next();
});

// Mount routes under both /games and /api/games for proxy compatibility
app.use('/games', gamesRoutes);
app.use('/api/games', gamesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Game Waitlist Express REST API is healthy",
    data: { status: "UP", timestamp: new Date().toISOString() }
  });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Game Waitlist Express REST API is healthy",
    data: { status: "UP", timestamp: new Date().toISOString() }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource '${req.method} ${req.originalUrl}' not found`,
    errors: ["Endpoint does not exist"]
  });
});

// Centralized Error Handler (Never crash server)
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    errors: [err.stack || "Unknown error occurred"]
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    // Production express listener
  });
}

export default app;
