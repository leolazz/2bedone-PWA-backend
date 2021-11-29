import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project])],
  providers: [TaskResolver, TaskService],
  exports: [TaskService],
})
export class TaskModule {}
