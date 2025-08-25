import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // Node environment
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Server
  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', '/api/v1');
  }

  // Database
  get dbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbDatabase(): string {
    return this.configService.get<string>('DB_DATABASE');
  }

  get dbSsl(): boolean {
    return this.configService.get<string>('DB_SSL', 'false') === 'true';
  }

  // JWT
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '1h');
  }

  // Redis
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT', 6379);
  }

  get redisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD', '');
  }

  get redisDb(): number {
    return this.configService.get<number>('REDIS_DB', 0);
  }

  get redisPrefix(): string {
    return this.configService.get<string>('REDIS_PREFIX', 'rex:');
  }

  // Email
  get smtpHost(): string {
    return this.configService.get<string>('SMTP_HOST');
  }

  get smtpPort(): number {
    return this.configService.get<number>('SMTP_PORT', 587);
  }

  get smtpUser(): string {
    return this.configService.get<string>('SMTP_USER');
  }

  get smtpPass(): string {
    return this.configService.get<string>('SMTP_PASS');
  }

  get smtpFrom(): string {
    return this.configService.get<string>('SMTP_FROM');
  }

  // SMS
  get smsApiKey(): string {
    return this.configService.get<string>('SMS_API_KEY');
  }

  get smsApiSecret(): string {
    return this.configService.get<string>('SMS_API_SECRET');
  }

  // Storage
  get supabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL');
  }

  get supabaseAnonKey(): string {
    return this.configService.get<string>('SUPABASE_ANON_KEY');
  }

  get supabaseServiceKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_KEY');
  }

  get storageBucket(): string {
    return this.configService.get<string>('STORAGE_BUCKET');
  }

  // Frontend
  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
  }

  // PDF Service
  get pdfServiceUrl(): string {
    return this.configService.get<string>('PDF_SERVICE_URL', 'http://localhost:3002');
  }

  // Timezone
  get defaultTimezone(): string {
    return this.configService.get<string>('DEFAULT_TIMEZONE', 'Africa/Douala');
  }
}

