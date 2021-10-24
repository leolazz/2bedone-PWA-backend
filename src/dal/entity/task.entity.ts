import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@ObjectType()
@Entity()
export class Task {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field((type) => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.tasks)
  public project: Project;

  @Field({ nullable: true })
  @Column()
  public title: string;

  @Field({ nullable: true })
  @Column()
  public details: string;

  @Field({ nullable: true })
  @Column()
  public outcomes: string;

  @Field({ nullable: true })
  @Column()
  public createdDate: string;

  @Field({ nullable: true })
  @Column()
  public endDate: string;

  @Field({ nullable: true })
  @Column()
  public isCompleted: boolean;
}
