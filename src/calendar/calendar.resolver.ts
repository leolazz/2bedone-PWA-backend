import { Args, Resolver, Query } from '@nestjs/graphql';
import { Calendar } from '../dal/entity/calendar.entity';

import { CalendarService } from './calendar.service';
import { CalendarOptions } from './calendarOptions.input';

@Resolver((of) => Calendar)
export class CalendarResolver {
  constructor(private calendarService: CalendarService) {}

  @Query(() => Calendar)
  async getMonth(
    @Args('calendarOptions') calendarOptions: CalendarOptions,
  ): Promise<Calendar> {
    let cal: Promise<Calendar> =
      this.calendarService.getEvents(calendarOptions);
    return cal;
  }
}
