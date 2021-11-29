import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getTasks(pageableOptions?: PageableOptions): Promise<[Task[], number]> {
    return await this.taskRepository.findAndCount({
      where: { isCompleted: pageableOptions.isCompleted },
      take: pageableOptions?.limit,
      skip: pageableOptions?.offset,
      order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
    });
  }

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
  async updateTask(task: CreateTaskDto) {
    return this.taskRepository.save({ ...task, project: null });
  }

  async removeProject(projectId: number) {
    const tasks = await this.taskRepository.find({ where: { projectId } });
    tasks.forEach((x) => (x.projectId = null));
    await this.taskRepository.save(tasks);
  }

  async findAllWithLimit(limit: number): Promise<Task[]> {
    return await this.taskRepository.find({ take: limit });
  }

  async findAllOprhanedTasks() {
    return this.taskRepository.find({
      where: { project: null, projectId: null, isCompleted: false },
    });
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
}
