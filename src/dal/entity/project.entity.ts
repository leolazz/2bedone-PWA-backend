import { Field } from '@nestjs/graphql';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

export class Project {
  @Field()
  @PrimaryGeneratedColumn()
  public id: number;

  @Field((type) => [Project], { nullable: true })
  @OneToMany(() => Task, (task) => task.project)
  public tasks: Task[];

  @Field({ nullable: true })
  @Column()
  public title: string;

  @Field({ nullable: true })
  @Column()
  public details: string;

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
