import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { CalendarResolver } from './calendar.resolver';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Task]),
    ProjectModule,
    TaskModule,
  ],
  providers: [CalendarResolver, CalendarService],
})
export class CalendarModule {}
