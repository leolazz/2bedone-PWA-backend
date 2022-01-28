import { Args, Resolver, Query } from '@nestjs/graphql';
import { Calendar } from '../dal/entity/calendar.entity';

import { CalendarService } from './calendar.service';

@Resolver((of) => Calendar)
export class CalendarResolver {
  constructor(private calendarService: CalendarService) {}

  @Query(() => Calendar)
  async getMonth(@Args('yearMonth') yearMonth: string): Promise<Calendar> {
    let cal: Promise<Calendar> = this.calendarService.getCalendar(yearMonth);
    return cal;
  }
}
