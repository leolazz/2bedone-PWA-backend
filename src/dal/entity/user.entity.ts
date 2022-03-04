import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  public email: string;

  @Column()
  public password: string;

  @Field((type) => Task, { nullable: true })
  @OneToMany(() => Task, (task) => task.user, {
    nullable: false,
  })
  public tasks?: Promise<Task[]>;

  @Field((type) => Project, { nullable: true })
  @OneToMany(() => Project, (project) => project.user, {
    nullable: false,
  })
  public projects?: Promise<Project[]>;
}
