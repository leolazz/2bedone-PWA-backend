import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  generateTypeOrmOrderOptions,
  PageableOptions,
} from '../dal/entity/pagination/paginatedResponse.helper';
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

  async deleteTask(userId, id: number) {
    const task = await this.taskRepository.findOne({
      where: { id, user: userId },
    });
    const deletedTask = await this.taskRepository.remove(task);
    return deletedTask;
  }

  async getTasks(
    userId: any,
    pageableOptions?: PageableOptions,
  ): Promise<[Task[], number]> {
    if (pageableOptions.search) {
      return await this.taskRepository.findAndCount({
        where: {
          user: userId,
          isCompleted: pageableOptions.isCompleted,
          title: Like(`%${pageableOptions.search}%`),
        },
        take: pageableOptions?.limit,
        skip: pageableOptions?.offset,
        order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
      });
    } else
      return await this.taskRepository.findAndCount({
        where: {
          user: userId,
          isCompleted: pageableOptions.isCompleted,
        },
        take: pageableOptions?.limit,
        skip: pageableOptions?.offset,
        order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
      });
  }

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const newTask = this.taskRepository.save({
      ...createTaskDto,
      project: null,
      user: userId,
    });
    return newTask;
  }
  async findOneById(userId: number, id: number) {
    return await this.taskRepository.findOne({ where: { id, user: userId } });
  }

  async getProject(userId: number, projectId: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id: projectId, user: userId },
    });
  }
  async updateTask(userId: number, task: CreateTaskDto) {
    return this.taskRepository.save({ ...task, project: null, user: userId });
  }

  async removeProject(userId: number, projectId: number) {
    const tasks = await this.taskRepository.find({
      where: { projectId, user: userId },
    });
    tasks.forEach((x) => (x.projectId = null));
    await this.taskRepository.save(tasks);
  }

  async findAllWithLimit(limit: number): Promise<Task[]> {
    return await this.taskRepository.find({ take: limit });
  }

  async findAllOprhanedTasks(userId: number) {
    return this.taskRepository.find({
      where: { project: null, projectId: null, isCompleted: false },
    });
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
}
