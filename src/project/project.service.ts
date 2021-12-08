import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import {
  generateTypeOrmOrderOptions,
  PageableOptions,
} from '../dal/entity/pagination/paginatedResponse.helper';
import { timeStamp } from 'console';
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

  async deleteProject(x: DeleteProjectInput) {
    const project = await this.projectRepository.findOne(x.id);
    let tasks = await this.taskRepository.find({
      where: { projectId: x.id },
    });
    if (x.deleteTasks) {
      tasks = tasks.map((x) => (x.projectId = null));
      tasks = await this.taskRepository.save(tasks);
      const deletedTasks = this.taskRepository.remove(tasks);
      const deletedProject = await this.projectRepository.remove(project);
      deletedProject.tasks = deletedTasks;
      return deletedProject;
    } else {
      tasks = tasks.map((x) => (x.projectId = null));
      tasks = await this.taskRepository.save(tasks);
      const deletedProject = await this.projectRepository.remove(project);
      return deletedProject;
    }
  }

  async findAll(isCompleted: boolean): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { isCompleted: isCompleted },
    });
  }
  async findAllWithLimit(limit: number): Promise<Project[]> {
    return await this.projectRepository.find({ take: limit });
  }

  async findOneById(projectId: number): Promise<Project> {
    return await this.projectRepository.findOne(projectId);
  }

  async getTasks(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { projectId: projectId } });
  }

  async getProjects(
    pageableOptions?: PageableOptions,
  ): Promise<[Project[], number]> {
    return await this.projectRepository.findAndCount({
      where: { isCompleted: pageableOptions.isCompleted },
      take: pageableOptions?.limit,
      skip: pageableOptions?.offset,
      order: generateTypeOrmOrderOptions(pageableOptions?.sortOptions),
    });
  }
  async updateProject(project: UpdateProjectDto): Promise<Project> {
    const updatedProject = await this.projectRepository.save(project);
    if (project.removeExistingTasks)
      await this.taskService.removeProject(project.id);

    let tasks = await this.taskRepository.find({
      where: { id: In(project.tasksId) },
    });
    tasks.forEach((task) => (task.projectId = updatedProject.id));
    let updatedTasks: any = await this.taskRepository.save(tasks);
    updatedProject.tasks = updatedTasks;
    return updatedProject;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    let newProject = await this.projectRepository.save(createProjectDto);
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
