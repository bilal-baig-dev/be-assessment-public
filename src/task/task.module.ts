import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'config';
import { TaskController } from './controller/task.controller';
import { Task } from './entities/task.entity';
import { TaskService } from './services/task.services';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [ConfigService, TaskService],
  exports: [],
  controllers: [TaskController],
})
export class TaskModule {}
