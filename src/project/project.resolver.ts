import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import { ProjectService } from './project.service';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [Project])
  async allProjects(): Promise<Project[]> {
    return this.projectService.findAll();
  }
  @Query(() => Project)
  async findOneProjectById(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<Project> {
    return this.projectService.findOneById(id);
  }

  @Mutation((returns) => Project)
  createProject(
    @Args('createProjectDto') createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(createProjectDto);
  }
  @ResolveField((returns) => Task)
  project(@Parent() project: Project): Promise<Task[]> {
    if (project.tasks) {
      return this.projectService.getTasks(project.id);
    } else return null;
  }
}
