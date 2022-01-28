import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Project } from './project.entity';
import { Task } from './task.entity';

@ObjectType()
export class Calendar {
  @Field((type) => [Task], { nullable: 'itemsAndList' })
  public tasks?: Promise<Task[]>;
  @Field((type) => [Project], { nullable: 'itemsAndList' })
  public projects?: Promise<Project[]>;
}
