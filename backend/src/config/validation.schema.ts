import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('/api/v1'),
  
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  
  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().default(0),
  REDIS_PREFIX: Joi.string().default('rex:'),
  
  // Email
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_FROM: Joi.string().email().required(),
  
  // SMS
  SMS_API_KEY: Joi.string().required(),
  SMS_API_SECRET: Joi.string().required(),
  
  // Storage
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),
  STORAGE_BUCKET: Joi.string().required(),
  
  // Frontend
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
  
  // PDF Service
  PDF_SERVICE_URL: Joi.string().default('http://localhost:3002'),
  
  // Timezone
  DEFAULT_TIMEZONE: Joi.string().default('Africa/Douala'),
});

