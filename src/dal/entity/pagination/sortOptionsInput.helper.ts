import { registerEnumType, InputType, Field, Int } from '@nestjs/graphql';
import { SortOptions } from './paginatedResponse.helper';

enum taskFields {
  ID = 'id',
  TITLE = 'title',
  PROJECTID = 'projectId',
  CREATEDDATE = 'createdDate',
  ENDDATE = 'endDate',
  ISCOMPLETED = 'isCompleted',
}

registerEnumType(taskFields, {
  name: 'Fields',
  description: 'fields to sort by',
});

type StandardEnum<T> = {
  [id: string]: T | string;
  [nu: number]: string;
};

export default function sortOptionsEnum<Enumerator>(
  TEnumType: StandardEnum<Enumerator>,
) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @InputType({ isAbstract: true })
  abstract class sortOptionsInput {
    @Field(() => TEnumType)
    public field: Enumerator;

    @Field()
    public ascending: boolean;
  }
  return sortOptionsInput;
}

@InputType()
export class SortOptionsTasksInput extends sortOptionsEnum(taskFields) {}

@InputType()
export class PageableOptionsTasks {
  @Field(() => Int, { nullable: true })
  public limit?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;

  @Field({ nullable: true })
  public sortOptions?: SortOptionsTasksInput;
}
/**
 *
 * @param sortOptions
 * @returns typeorm order param compatible result
 */
export function generateTypeOrmOrderOptions(sortOptions?: SortOptions): {
  [field: string]: 'ASC' | 'DESC';
} {
  return sortOptions
    ? {
        [`${sortOptions?.field}`]: sortOptions?.ascending ? 'ASC' : 'DESC',
      }
    : undefined;
}
