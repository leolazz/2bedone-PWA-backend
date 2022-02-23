import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as path from 'path';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { CalendarModule } from './calendar/calendar.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TaskModule,
    ProjectModule,
    CalendarModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join('data', 'sqlite3.db'),
      entities: [__dirname + '/dal/entity/**/*.*.*'],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
