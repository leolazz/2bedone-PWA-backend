import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import {
  generateTypeOrmOrderOptions,
  PageableOptions,
} from '../dal/entity/pagination/paginatedResponse.helper';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { TaskService } from '../task/task.service';
import { DeleteProjectInput } from './dto/DeleteProject-input';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly taskService: TaskService,
  ) {}

  async deleteProject(userId: number, x: DeleteProjectInput) {
    const project = await this.projectRepository.findOne({
      where: { id: x.id, user: userId },
    });
    let tasks = await this.taskRepository.find({
      where: { projectId: x.id },
    });
    if (x.deleteTasks) {
      tasks = tasks.map((x) => {
        x = x;
        x.projectId = null;
        return x;
      });
      tasks = await this.taskRepository.save(tasks);
      const deletedTasks = this.taskRepository.remove(tasks);
      const deletedProject = await this.projectRepository.remove(project);
      deletedProject.tasks = deletedTasks;
      return deletedProject;
    } else {
      tasks = tasks.map((x) => {
        x = x;
        x.projectId = null;
        return x;
      });
      tasks = await this.taskRepository.save(tasks);
      const deletedProject = await this.projectRepository.remove(project);
      return deletedProject;
    }
  }

  async findAll(userId: number, isCompleted: boolean): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { isCompleted: isCompleted, user: userId },
    });
  }
  async findAllWithLimit(limit: number): Promise<Project[]> {
    return await this.projectRepository.find({ take: limit });
  }

  async findOneById(userId: number, projectId: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id: projectId, user: userId },
    });
  }

  async getTasks(userId: number, projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { projectId: projectId, user: userId },
    });
  }

  async getProjects(
    userId: number,
    pageableOptions?: PageableOptions,
  ): Promise<[Project[], number]> {
    if (pageableOptions.search) {
      return await this.projectRepository.findAndCount({
        where: {
          user: userId,
          isCompleted: pageableOptions.isCompleted,
          title: Like(`%${pageableOptions.search}%`),
        },
        take: pageableOptions?.limit,
        skip: pageableOptions?.offset,
        order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
      });
    } else {
      return await this.projectRepository.findAndCount({
        where: {
          user: userId,
          isCompleted: pageableOptions.isCompleted,
        },
        take: pageableOptions?.limit,
        skip: pageableOptions?.offset,
        order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
      });
    }
  }
  async updateProject(
    userId: number,
    project: UpdateProjectDto,
  ): Promise<Project> {
    const updatedProject = await this.projectRepository.save({
      ...project,
      user: userId,
    });
    if (project.tasksToRemoveId.length) {
      let tasksToRemove = await this.taskRepository.find({
        where: { id: In(project.tasksToRemoveId) },
      });
      tasksToRemove = tasksToRemove.map((x) => {
        x = x;
        x.projectId = null;
        return x;
      });
      tasksToRemove = await this.taskRepository.save(tasksToRemove);
    }

    let newTasks, priorTasks;
    newTasks = await this.taskRepository.find({
      where: { id: In(project.tasksId) },
    });
    priorTasks = await this.taskRepository.find({
      where: { projectId: project.id },
    });
    let updatedTasks: any = [...priorTasks, ...newTasks];
    newTasks.forEach((task) => (task.projectId = updatedProject.id));

    if (updatedProject.isCompleted) {
      updatedTasks.forEach((task) => (task.isCompleted = true));
    }
    updatedTasks = await this.taskRepository.save(updatedTasks);
    updatedProject.tasks = updatedTasks;
    return updatedProject;
  }

  async createProject(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    let newProject = await this.projectRepository.save({
      ...createProjectDto,
      user: userId,
    });
    let tasks = await this.taskRepository.find({
      where: { id: In(createProjectDto.tasksId) },
    });
    tasks.forEach((task) => (task.projectId = newProject.id));
    /**
     *  type is set to any to allow awaiting the save.
     *  Otherwise it does not return before the method
     */
    let newTasks: any = await this.taskRepository.save(tasks);

    newProject.tasks = newTasks;
    return newProject;
  }
}
