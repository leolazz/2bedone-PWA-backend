import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskEvent {
  @Field((type) => Int)
  public id: number;

  @Field((type) => Int, { nullable: true })
  public projectId?: number;

  @Field({ nullable: false })
  public title: string;

  @Field({ nullable: true })
  public details?: string;

  @Field({ nullable: true })
  public outcomes?: string;

  @Field({ nullable: false })
  public startTime: Date;

  @Field({ nullable: false })
  public endTime: Date;

  @Field({ nullable: false })
  public isCompleted: boolean;
}
