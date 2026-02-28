// SaleManager Backend - Main Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Config
import { loadEnvConfig, logEnvConfig } from './config/env.js';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';
import { securityHeaders } from './middleware/security.js';

// Routes
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import leadRoutes from './routes/leads.js';
import opportunityRoutes from './routes/opportunities.js';
import activityRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';
import emailRoutes from './routes/emails.js';

// Load and validate environment variables
dotenv.config();
const config = loadEnvConfig();

// Log configuration (without sensitive data)
logEnvConfig(config);

const app = express();

// Configure CORS with whitelist from validated config
const allowedOrigins = config.corsOrigin;

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

// Security headers
app.use(securityHeaders);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (public)
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
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
app.listen(config.port, () => {
  console.log(`════════════════════════════════════════════════════════════`);
  console.log(`🚀 SaleManager Backend Server Started`);
  console.log(`════════════════════════════════════════════════════════════`);
  console.log(`📡 Server:     http://localhost:${config.port}`);
  console.log(`🏥 Health:     http://localhost:${config.port}/health`);
  console.log(`📊 API:        http://localhost:${config.port}/api`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`════════════════════════════════════════════════════════════`);
});

export default app;
