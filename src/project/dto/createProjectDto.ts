import { Field, InputType, Int } from '@nestjs/graphql';
import { Task } from '../../dal/entity/task.entity';
import { CreateTaskDto } from '../../task/dto/createTaskDto';

@InputType()
export class CreateProjectDto {
  // @Field((type) => [CreateTaskDto], { nullable: true })
  // public tasks?: Task[];

  @Field((type) => [Int], { nullable: true })
  public tasksId: number[];

  @Field({ nullable: true })
  public title: string;

  @Field({ nullable: true })
  public details: string;

  @Field({ nullable: true })
  public createdDate: string;

  @Field({ nullable: true })
  public endDate: string;

  @Field({ nullable: true })
  public isCompleted: boolean;
}
