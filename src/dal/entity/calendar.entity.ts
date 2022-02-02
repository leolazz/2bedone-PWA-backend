import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from './project.entity';
import { ProjectEvent } from './projectEvent.entity';
import { Task } from './task.entity';
import { TaskEvent } from './taskEvent.entity';

@ObjectType()
export class Calendar {
  @Field((type) => [TaskEvent], { nullable: 'itemsAndList' })
  public tasks?: TaskEvent[];
  @Field((type) => [ProjectEvent], { nullable: 'itemsAndList' })
  public projects?: ProjectEvent[];
}
