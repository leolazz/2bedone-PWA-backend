import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Task } from '../dal/entity/task.entity';

@Resolver()
export class TaskResolver {
  // constructor(
  //   private authorsService: TaskService,
  //   private postsService: PostsService,
  // ) {}

  @Query(() => String)
  async hello() {
    return 'hello world';
  }
}
