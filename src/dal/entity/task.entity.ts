import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Task {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field((type) => Int)
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  public user: number;

  @Field((type) => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: true,
    cascade: true,
  })
  public project?: Promise<Project>;

  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  public projectId?: number;

  @Field({ nullable: false })
  @Column()
  public title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public details?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public outcomes?: string;

  @Field({ nullable: false })
  @Column()
  public createdDate: string;

  @Field({ nullable: false })
  @Column()
  public endDate: string;

  @Field({ nullable: false })
  @Column()
  public isCompleted: boolean;
}
