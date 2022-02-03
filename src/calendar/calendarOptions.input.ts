import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CalendarOptions {
  @Field(() => String, { nullable: false })
  public yearMonth: string;

  @Field(() => String, { nullable: true })
  public yearMonthOverlap?: string;
}
