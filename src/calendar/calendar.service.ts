import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Calendar } from '../dal/entity/calendar.entity';
import { Project } from '../dal/entity/project.entity';
import { ProjectEvent } from '../dal/entity/projectEvent.entity';
import { Task } from '../dal/entity/task.entity';
import { TaskEvent } from '../dal/entity/taskEvent.entity';
import { CalendarOptions } from './calendarOptions.input';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getEvents(calendarOptions: CalendarOptions): Promise<Calendar> {
    return {
      projects: await this.transformProjectToEvent(
        await this.getProjects(
          calendarOptions.yearMonth,
          calendarOptions.yearMonthOverlap,
        ),
      ),
      tasks: this.transformTaskToEvent(
        await this.getTasks(
          calendarOptions.yearMonth,
          calendarOptions.yearMonthOverlap,
        ),
      ),
    };
  }

  transformTaskToEvent(tasks: Task[]) {
    const taskEvents: TaskEvent[] = [];
    tasks.forEach((x) => {
      let startTime = new Date(x.endDate);
      startTime.setHours(startTime.getHours() - 1);
      taskEvents.push({ ...x, startTime, endTime: new Date(x.endDate) });
    });
    return taskEvents;
  }
  transformProjectToEvent(projects: Project[]) {
    const projectEvents: ProjectEvent[] = [];
    projects.forEach(async (x) => {
      let startTime = new Date(x.endDate);
      startTime.setHours(startTime.getHours() - 1);
      projectEvents.push({
        ...x,
        startTime,
        endTime: new Date(x.endDate),
      });
    });
    return projectEvents;
  }

  async getTasks(yearMonth: string, yearMonthOverlap?: string) {
    let taskEvents = await this.taskRepository.find({
      where: {
        isCompleted: false,
        endDate: Like(`${yearMonth}%`),
      },
    });
    if (yearMonthOverlap) {
      const overlapTaskEvents = await this.taskRepository.find({
        where: {
          isCompleted: false,
          endDate: Like(`${yearMonthOverlap}%`),
        },
      });
      taskEvents = [...taskEvents, ...overlapTaskEvents];
    }

    return taskEvents;
  }
  async getProjects(yearMonth: string, yearMonthOverlap?: string) {
    let projectEvents = await this.projectRepository.find({
      where: {
        isCompleted: false,
        endDate: Like(`${yearMonth}%`),
      },
    });
    if (yearMonthOverlap) {
      const overlapprojectEvents = await this.projectRepository.find({
        where: {
          isCompleted: false,
          endDate: Like(`${yearMonthOverlap}%`),
        },
      });
      projectEvents = [...projectEvents, ...overlapprojectEvents];
    }

    return projectEvents;
  }
}
