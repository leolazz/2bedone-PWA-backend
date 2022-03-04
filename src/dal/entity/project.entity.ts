import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Project {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field((type) => Int)
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
  })
  public user: number;
  /**
   * handled with field resolver
   */
  @OneToMany(() => Task, (task) => task.project, {
    nullable: true,
  })
  public tasks?: Promise<Task[]>;

  @Field({ nullable: false })
  @Column()
  public title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public details: string;

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
