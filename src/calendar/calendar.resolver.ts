import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/gql-jwt-auth.guard';
import { Calendar } from '../dal/entity/calendar.entity';
import { UserId } from '../users/user.decorator';

import { CalendarService } from './calendar.service';
import { CalendarOptions } from './calendarOptions.input';

@UseGuards(GqlJwtAuthGuard)
@Resolver((of) => Calendar)
export class CalendarResolver {
  constructor(private calendarService: CalendarService) {}

  @Query(() => Calendar)
  async getMonth(
    @UserId() userId,
    @Args('calendarOptions') calendarOptions: CalendarOptions,
  ): Promise<Calendar> {
    let cal: Promise<Calendar> = this.calendarService.getEvents(
      userId,
      calendarOptions,
    );
    return cal;
  }
}
