import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Repository } from 'typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateTaskDto } from './dto/createTaskDto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.save({
      ...createTaskDto,
      project: null,
    });
    return newTask;
  }

  async getProject(projectId: number): Promise<Project> {
    return await this.projectRepository.findOne(projectId);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
}
