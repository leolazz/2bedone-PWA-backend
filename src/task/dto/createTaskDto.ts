import { Field, InputType, Int } from '@nestjs/graphql';
import { Project } from '../../dal/entity/project.entity';
import { CreateProjectDto } from '../../project/dto/createProjectDto';

@InputType()
export class CreateTaskDto {
  @Field((type) => Int, { nullable: true })
  public id?: number;

  @Field((type) => CreateProjectDto, { nullable: true })
  public project?: Project;

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
