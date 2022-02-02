import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectEvent {
  @Field((type) => Int)
  public id: number;

  @Field((type) => [Int], { nullable: true })
  public taskIds?: number[];

  @Field({ nullable: false })
  public title: string;

  @Field({ nullable: true })
  public details: string;

  @Field({ nullable: false })
  public startTime: Date;

  @Field({ nullable: false })
  public endTime: Date;

  @Field({ nullable: false })
  public isCompleted: boolean;
}
