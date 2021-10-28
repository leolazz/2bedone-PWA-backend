import { Field, InputType, Int } from '@nestjs/graphql';
import { Project } from '../../dal/entity/project.entity';

@InputType()
export class CreateTaskInput {
  // Project field removed to avoid missfilling data in the api
  // This class serves to be used when creating a task from the task resolver, createtaskdto is used for the project resolver

  @Field((type) => Int, { nullable: true })
  public projectId?: number;

  @Field()
  public title: string;

  @Field({ nullable: true })
  public details: string;

  @Field({ nullable: true })
  public outcomes: string;

  @Field()
  public createdDate: string;

  @Field()
  public endDate: string;

  @Field()
  public isCompleted: boolean;
}
