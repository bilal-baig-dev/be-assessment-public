import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { TaskModule } from 'task/task.module';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule, UserModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
