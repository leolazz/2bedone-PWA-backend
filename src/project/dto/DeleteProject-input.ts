import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class DeleteProjectInput {
  @Field((type) => Int)
  public id: number;

  @Field()
  public deleteTasks: boolean;
}
