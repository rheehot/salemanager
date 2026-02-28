// SaleManager Backend - Main Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import leadRoutes from './routes/leads.js';
import opportunityRoutes from './routes/opportunities.js';
import activityRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';
import emailRoutes from './routes/emails.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS with whitelist
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (public)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/customers', authenticate, customerRoutes);
app.use('/api/leads', authenticate, leadRoutes);
app.use('/api/opportunities', authenticate, opportunityRoutes);
app.use('/api/activities', authenticate, activityRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/emails', authenticate, emailRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SaleManager Backend Server`);
  console.log(`📡 Running on http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Authentication: ${process.env.JWT_SECRET ? 'Configured' : 'Using default (DEVELOPMENT ONLY)'}`);
});

export default app;
