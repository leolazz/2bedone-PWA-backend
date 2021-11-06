import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@ObjectType()
@Entity()
export class Project {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: number;

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
