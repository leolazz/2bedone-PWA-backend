import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateProjectDto } from './dto/createProjectDto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    let newProject = await this.projectRepository.save({
      ...createProjectDto,
      tasks: null,
    });
    let newTasks = await this.taskRepository.save(
      createProjectDto.tasks.map((x) => ({
        ...x,
        // TODO: Add projectId field to task entity
        projectId: newProject.id,
      })),
    );

    return newProject;
  }
}
