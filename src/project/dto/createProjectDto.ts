import { Field, InputType, Int } from '@nestjs/graphql';
import { Task } from '../../dal/entity/task.entity';
import { CreateTaskDto } from '../../task/dto/createTaskDto';

@InputType()
export class CreateProjectDto {
  // @Field((type) => [CreateTaskDto], { nullable: true })
  // public tasks?: Task[];

  @Field((type) => [Int], { nullable: 'itemsAndList' })
  public tasksId?: number[];

  @Field({ nullable: false })
  public title: string;

  @Field({ nullable: true })
  public details: string;

  @Field({ nullable: false })
  public createdDate: string;

  @Field({ nullable: false })
  public endDate: string;

  @Field({ nullable: false })
  public isCompleted: boolean;
}
