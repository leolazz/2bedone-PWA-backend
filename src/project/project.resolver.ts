import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import {
  PageableOptions,
  PaginatedProjectsResponse,
} from '../dal/entity/pagination/paginatedResponse.helper';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { UserId } from '../users/user.decorator';
import { CreateProjectDto } from './dto/createProjectDto';
import { DeleteProjectInput } from './dto/DeleteProject-input';
import { UpdateProjectDto } from './dto/updateProjectDto';
import { ProjectService } from './project.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver((of) => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [Project])
  async allProjects(
    @UserId() userId,
    @Args('isCompleted') isCompleted: boolean,
  ): Promise<Project[]> {
    return this.projectService.findAll(userId, isCompleted);
  }
  @Query(() => Project)
  async findOneProjectById(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Project> {
    return this.projectService.findOneById(userId, id);
  }
  @Query(() => PaginatedProjectsResponse)
  async paginatedProjects(
    @UserId() userId,
    @Args('pageableOptions', { nullable: true })
    PageableOptions?: PageableOptions,
  ): Promise<PaginatedProjectsResponse> {
    const [items, total] = await this.projectService.getProjects(
      userId,
      PageableOptions,
    );
    return {
      items,
      total,
    };
  }

  @Mutation((returns) => Project)
  updateProject(
    @UserId() userId,
    @Args('updateProjectDto') updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(userId, updateProjectDto);
  }
  @Mutation((returns) => Project)
  deleteProject(
    @UserId() userId,
    @Args('deleteProjectInput') deleteProjectInput: DeleteProjectInput,
  ): Promise<Project> {
    return this.projectService.deleteProject(userId, deleteProjectInput);
  }

  @Mutation((returns) => Project)
  createProject(
    @UserId() userId,
    @Args('createProjectDto') createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(userId, createProjectDto);
  }
  @ResolveField((returns) => [Task], { nullable: 'itemsAndList' })
  tasks(@UserId() userId, @Parent() project: Project): Promise<Task[]> {
    if (project.tasks) {
      return this.projectService.getTasks(userId, project.id);
    } else return null;
  }
}
