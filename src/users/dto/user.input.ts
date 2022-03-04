import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  public email: string;

  @Field()
  public password: string;
}
