import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Calendar } from '../dal/entity/calendar.entity';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getCalendar(yearMonth: string): Promise<Calendar> {
    const tasks = this.getTasks(yearMonth);
    const projects = this.getProjects(yearMonth);
    const cal: Calendar = { tasks: tasks, projects: projects };
    return cal;
  }

  async getTasks(yearMonth: string) {
    return await this.taskRepository.find({
      where: {
        isCompleted: false,
        endDate: Like(`${yearMonth}%`),
      },
    });
  }
  async getProjects(yearMonth: string) {
    return await this.projectRepository.find({
      where: {
        isCompleted: false,
        endDate: Like(`${yearMonth}%`),
      },
    });
  }
}
