import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Task } from '../dal/entity/task.entity';
import { CreateTaskDto } from './dto/createTaskDto';
import { TaskService } from './task.service';

@Resolver()
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => [Task])
  async TasksAll() {
    return await this.taskService.findAll();
  }

  @Mutation((returns) => Task)
  createTask(
    @Args('createTaskDto') createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }
}
