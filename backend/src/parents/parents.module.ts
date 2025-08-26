import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { Parent } from './entities/parent.entity';
import { ParentPreferences } from './entities/parent-preferences.entity';
import { ParentNotificationLog } from './entities/parent-notification-log.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parent,
      ParentPreferences,
      ParentNotificationLog,
      Student,
      User,
    ]),
    ConfigModule,
  ],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}

