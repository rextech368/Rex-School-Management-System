import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'rex_school_management'),
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
    synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
    logging: configService.get<string>('NODE_ENV', 'development') !== 'production',
    ssl: configService.get<string>('DB_SSL', 'false') === 'true',
  };
};

