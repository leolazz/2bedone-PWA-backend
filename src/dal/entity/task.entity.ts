import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@ObjectType()
@Entity()
export class Task {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field((type) => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: true,
    cascade: true,
  })
  public project?: Promise<Project>;

  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  public projectId?: number;

  @Field({ nullable: true })
  @Column()
  public title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public details?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public outcomes?: string;

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
