import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from 'nestjs-redis';

export const redisConfig = (
  configService: ConfigService,
): RedisModuleOptions => {
  return {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD', ''),
    db: configService.get<number>('REDIS_DB', 0),
    keyPrefix: configService.get<string>('REDIS_PREFIX', 'rex:'),
    retryStrategy: (times) => Math.min(times * 50, 2000),
  };
};

