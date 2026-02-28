// Environment Variable Validation
/**
 * Validate and load environment variables
 * Throws error if required variables are missing in production
 */

interface EnvConfig {
  // Server
  port: number;
  nodeEnv: string;

  // Database
  databaseUrl: string;

  // CORS
  corsOrigin: string[];

  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;

  // Email (optional)
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  emailFrom?: string;

  // Frontend
  frontendUrl?: string;
}

/**
 * Get required environment variable or throw error in production
 */
function getRequiredEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    throw new Error(`Required environment variable '${key}' is not set in production`);
  }

  // In development, return a safe default
  return '';
}

/**
 * Get optional environment variable
 */
function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Get numeric environment variable
 */
function getNumericEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;

  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable '${key}' must be a number`);
  }

  return num;
}

/**
 * Validate and parse CORS origins
 */
function parseCorsOrigins(corsValue?: string): string[] {
  if (!corsValue) {
    return ['http://localhost:5173'];
  }

  return corsValue.split(',').map(origin => origin.trim());
}

/**
 * Validate JWT secret strength
 */
function validateJwtSecret(secret: string): void {
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
  }

  // Warn if using default development secret
  if (secret === 'dev-secret-key-change-in-production' || secret === 'your-secret-key-min-32-characters') {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      throw new Error('JWT_SECRET is using default value. Change it in production!');
    }
    console.warn('⚠️  WARNING: Using default JWT secret. Change JWT_SECRET in production!');
  }
}

/**
 * Load and validate all environment variables
 */
export function loadEnvConfig(): EnvConfig {
  const nodeEnv = getRequiredEnv('NODE_ENV', 'development');
  const port = getNumericEnv('PORT', 3000);
  const databaseUrl = getRequiredEnv('DATABASE_URL', 'file:./prisma/salemanager.db');
  const corsOrigin = parseCorsOrigins(getOptionalEnv('CORS_ORIGIN'));
  const jwtSecret = getRequiredEnv('JWT_SECRET', 'dev-secret-key-change-in-production');
  const jwtExpiresIn = getRequiredEnv('JWT_EXPIRES_IN', '7d');

  // Validate JWT secret
  validateJwtSecret(jwtSecret);

  // Optional email configuration
  const smtpHost = getOptionalEnv('SMTP_HOST');
  const smtpPort = getNumericEnv('SMTP_PORT', 587);
  const smtpUser = getOptionalEnv('SMTP_USER');
  const smtpPass = getOptionalEnv('SMTP_PASS');
  const emailFrom = getOptionalEnv('EMAIL_FROM', 'noreply@salemanager.com');
  const frontendUrl = getOptionalEnv('FRONTEND_URL', 'http://localhost:5173');

  return {
    port,
    nodeEnv,
    databaseUrl,
    corsOrigin,
    jwtSecret,
    jwtExpiresIn,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    emailFrom,
    frontendUrl,
  };
}

/**
 * Log environment configuration (without sensitive data)
 */
export function logEnvConfig(config: EnvConfig): void {
  const isProduction = config.nodeEnv === 'production';

  console.log('════════════════════════════════════════════════════════════');
  console.log('🔧 Environment Configuration');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`  Node Env:     ${config.nodeEnv}`);
  console.log(`  Port:         ${config.port}`);
  console.log(`  Database:     ${config.databaseUrl.includes('file:') ? 'SQLite (local)' : 'External DB'}`);
  console.log(`  CORS Origins: ${config.corsOrigin.join(', ')}`);
  console.log(`  JWT Secret:   ${config.jwtSecret.length >= 32 ? '✅ Configured (32+ chars)' : '⚠️  Too short!'}`);
  console.log(`  JWT Expires:  ${config.jwtExpiresIn}`);
  console.log(`  Email:        ${config.smtpHost ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`  Frontend:     ${config.frontendUrl}`);
  console.log('════════════════════════════════════════════════════════════');

  if (isProduction) {
    console.log('🚀 Running in PRODUCTION mode');
  } else {
    console.log('🛠️  Running in DEVELOPMENT mode');
    console.log('⚠️  Warning: Default secrets are being used!');
  }
  console.log('════════════════════════════════════════════════════════════');
}
