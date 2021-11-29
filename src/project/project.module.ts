import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { TaskModule } from '../task/task.module';
import { TaskService } from '../task/task.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), TaskModule],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
