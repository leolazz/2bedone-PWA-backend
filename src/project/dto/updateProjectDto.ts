import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProjectDto {
  @Field((type) => Int)
  public id?: number;

  @Field((type) => [Int], { nullable: 'itemsAndList' })
  public tasksToRemoveId?: number[];

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
