import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Calendar } from '../dal/entity/calendar.entity';
import { Project } from '../dal/entity/project.entity';
import { ProjectEvent } from '../dal/entity/projectEvent.entity';
import { Task } from '../dal/entity/task.entity';
import { TaskEvent } from '../dal/entity/taskEvent.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async getEvents(yearMonth: string): Promise<Calendar> {
    return {
      projects: await this.transformProjectToEvent(
        await this.getProjects(yearMonth),
      ),
      tasks: this.transformTaskToEvent(await this.getTasks(yearMonth)),
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

  // async transformToEvents(yearMonth: string): Promise<Calendar> {
  //   const month = {
  //     tasks: await this.getTasks(yearMonth),
  //     projects: await this.getProjects(yearMonth),
  //   };
  //   const taskEvents: TaskEvent[] = [];
  //   const projectEvents: ProjectEvent[] = [];
  //   month.tasks.forEach((x) => {
  //     let startTime = new Date(x.endDate);
  //     startTime.setHours(startTime.getHours() - 1);
  //     taskEvents.push({ ...x, startTime, endDate: new Date(x.endDate) });
  //   });
  //   month.projects.forEach(async (x) => {
  //     let startTime = new Date(x.endDate);
  //     startTime.setHours(startTime.getHours() - 1);
  //     const tasks = await this.taskRepository.find({
  //       where: { projectId: x.id },
  //     });
  //     const taskIds = tasks.map((x) => x.id);
  //     projectEvents.push({
  //       ...x,
  //       startTime,
  //       endDate: new Date(x.endDate),
  //       taskIds,
  //     });
  //   });

  //   return {
  //     tasks: taskEvents,
  //     projects: projectEvents,
  //   };
  // }

  async getTasks(yearMonth: string) {
    return await this.taskRepository.find({
      where: {
        isCompleted: false,
        endDate: Like(`${yearMonth}%`) || Like(`${yearMonth}%`),
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
