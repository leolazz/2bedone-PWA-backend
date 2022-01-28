import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    TaskModule,
    ProjectModule,
    CalendarModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/sqlite3.db',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
