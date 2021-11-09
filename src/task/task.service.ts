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
  async findOneById(id: number) {
    return await this.taskRepository.findOne(id);
  }

  async getProject(projectId: number): Promise<Project> {
    return await this.projectRepository.findOne(projectId);
  }

  async findAllWithLimit(limit: number): Promise<Task[]> {
    return await this.taskRepository.find({ take: limit });
  }

  async findAllOprhanedTasks() {
    return this.taskRepository.find({
      where: { project: null, projectId: null },
    });
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
}
