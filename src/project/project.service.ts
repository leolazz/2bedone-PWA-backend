import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { In, Repository } from 'typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { TaskService } from '../task/task.service';
import { CreateProjectDto } from './dto/createProjectDto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
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

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    let newProject = await this.projectRepository.save({ ...createProjectDto });
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
