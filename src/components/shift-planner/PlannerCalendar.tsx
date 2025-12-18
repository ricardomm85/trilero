'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ShiftPlanner } from '@/types';
import type { DateClickArg } from '@fullcalendar/interaction';
import { differenceInCalendarMonths } from 'date-fns';
import { formatDateToYYYYMMDD, parseDateString } from '@/utils/dates';
import type { EventInput } from '@fullcalendar/core';

const CalendarWrapper = dynamic(
  () => import('./CalendarWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  }
);

interface PlannerCalendarProps {
  planner: ShiftPlanner;
  onDateClick: (arg: DateClickArg) => void;
}

export default function PlannerCalendar({ planner, onDateClick }: PlannerCalendarProps) {
  const { startDate, endDate, staff, assignments, holidays } = planner;

  const events: EventInput[] = useMemo(() => {
    const eventList: EventInput[] = Object.entries(assignments).flatMap(([date, staffIds]) =>
      staffIds.map(staffId => {
        const person = staff.find(s => s.id === staffId);
        return {
          id: `${date}-${staffId}`,
          title: person?.name || 'Unknown',
          date,
          backgroundColor: person?.color || '#808080',
          borderColor: person?.color || '#808080',
          textColor: 'white',
          allDay: true
        };
      })
    );

    holidays.forEach(holiday => {
      eventList.push({
        id: holiday.date,
        start: holiday.date,
        display: 'background',
        backgroundColor: '#FFD700'
      });
    });

    return eventList;
  }, [assignments, staff, holidays]);

  const monthCount = differenceInCalendarMonths(parseDateString(endDate), parseDateString(startDate)) + 1;

  const inclusiveEndDate = parseDateString(endDate);
  inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);

  return (
    <div className="w-full">
      <CalendarWrapper
        startDate={startDate}
        endDate={formatDateToYYYYMMDD(inclusiveEndDate)}
        monthCount={monthCount}
        events={events}
        onDateClick={onDateClick}
      />
    </div>
  );
}
