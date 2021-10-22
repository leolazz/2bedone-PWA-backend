import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/dal/entity/**/*.entity.ts'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
