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
  PaginatedTasksResponse,
} from '../dal/entity/pagination/paginatedResponse.helper';
import { Project } from '../dal/entity/project.entity';
import { Task } from '../dal/entity/task.entity';
import { UserId } from '../users/user.decorator';
import { CreateTaskInput } from './dto/createTask-input';
import { CreateTaskDto } from './dto/createTaskDto';
import { TaskService } from './task.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver((of) => Task)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => [Task])
  async allTasks() {
    return this.taskService.findAll();
  }

  @Query(() => [Task])
  async allTasksLimit(
    @UserId() userId,
    @Args({ name: 'limit', type: () => Int }) limit: number,
  ): Promise<Task[]> {
    return this.taskService.findAllWithLimit(limit);
  }
  @Query(() => PaginatedTasksResponse)
  async paginatedTasks(
    @UserId() userId,
    @Args('pageableOptions', { nullable: true })
    PageableOptions?: PageableOptions,
  ): Promise<PaginatedTasksResponse> {
    const [items, total] = await this.taskService.getTasks(
      userId,
      PageableOptions,
    );
    return {
      items,
      total,
    };
  }

  @Query(() => [Task])
  async allOrphanTasks(@UserId() userId): Promise<Task[]> {
    return this.taskService.findAllOprhanedTasks(userId);
  }
  @Query(() => Task)
  async findOneTaskById(
    @UserId() userId,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Task> {
    return this.taskService.findOneById(userId, id);
  }

  // This seems weird. without the if statement a project is always returned even if there is no supplied projectId
  @ResolveField((returns) => Project)
  project(@UserId() userId, @Parent() task: Task): Promise<Project> {
    if (task.projectId) {
      return this.taskService.getProject(userId, task.projectId);
    } else return null;
  }

  @Mutation((returns) => Task)
  updateTask(
    @UserId() userId,
    @Args('createTaskDto') createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(userId, createTaskDto);
  }

  @Mutation((returns) => Task)
  deleteTask(@UserId() userId, @Args('id') id: number): Promise<Task> {
    return this.taskService.deleteTask(userId, id);
  }

  @Mutation((returns) => Task)
  createTask(
    @UserId() userId,
    @Args('createTaskDto') createTaskDto: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.createTask(userId, createTaskDto);
  }
}
