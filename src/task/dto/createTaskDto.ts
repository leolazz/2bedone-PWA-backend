import { Field, InputType } from '@nestjs/graphql';
import { Project } from '../../dal/entity/project.entity';
import { CreateProjectDto } from '../../project/dto/createProjectDto';

@InputType()
export class CreateTaskDto {
  @Field((type) => CreateProjectDto, { nullable: true })
  public project?: Project;

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
