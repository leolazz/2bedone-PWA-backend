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
import {
  PageableOptions,
  PaginatedProjectsResponse,
} from '../dal/entity/pagination/paginatedResponse.helper';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { CreateProjectDto } from './dto/createProjectDto';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { ProjectService } from './project.service';

@Resolver((of) => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [Project])
  async allProjects(
    @Args('isCompleted') isCompleted: boolean,
  ): Promise<Project[]> {
    return this.projectService.findAll(isCompleted);
  }
  @Query(() => Project)
  async findOneProjectById(
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Project> {
    return this.projectService.findOneById(id);
  }
  @Query(() => PaginatedProjectsResponse)
  async paginatedProjects(
    @Args('pageableOptions', { nullable: true })
    PageableOptions?: PageableOptions,
  ): Promise<PaginatedProjectsResponse> {
    const [items, total] = await this.projectService.getProjects(
      PageableOptions,
    );
    return {
      items,
      total,
    };
  }

  @Mutation((returns) => Project)
  updateProject(
    @Args('updateProjectDto') updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(updateProjectDto);
  }
  @Mutation((returns) => Project)
  deleteProject(@Args('id') id: number): Promise<Project> {
    return this.projectService.deleteProject(id);
  }

  @Mutation((returns) => Project)
  createProject(
    @Args('createProjectDto') createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(createProjectDto);
  }
  @ResolveField((returns) => [Task], { nullable: 'itemsAndList' })
  tasks(@Parent() project: Project): Promise<Task[]> {
    if (project.tasks) {
      return this.projectService.getTasks(project.id);
    } else return null;
  }
}
