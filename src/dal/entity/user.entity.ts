import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { Task } from './task.entity';

@ObjectType()
@Entity()
export class User {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column()
  public username: string;

  @Field(() => String)
  @Column()
  public password: string;

  @Field((type) => Task, { nullable: true })
  public tasks?: Promise<Task[]>;

  @Field((type) => Project, { nullable: true })
  public projects?: Promise<Project[]>;
}
