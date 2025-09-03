'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ShiftPlanner } from '@/types';
import { EventInput } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { differenceInCalendarMonths } from 'date-fns';

interface PlannerCalendarProps {
  planner: ShiftPlanner;
  onDateClick: (arg: DateClickArg) => void;
}

export default function PlannerCalendar({ planner, onDateClick }: PlannerCalendarProps) {
  const { startDate, endDate, staff, assignments, holidays } = planner;

  const events: EventInput[] = Object.entries(assignments).flatMap(([date, staffIds]) => 
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

  // Add holidays as background events
  holidays.forEach(holiday => {
    events.push({
      id: holiday.date,
      start: holiday.date,
      display: 'background',
      backgroundColor: '#FFD700' // Gold color for holidays
    });
  });

  const monthCount = differenceInCalendarMonths(new Date(endDate), new Date(startDate)) + 1;

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'title',
          center: '',
          right: ''
        }}
        views={{
          multiMonth: {
            type: 'dayGrid',
            duration: { months: monthCount > 0 ? monthCount : 1 },
          }
        }}
        initialView={'multiMonth'}
        height={"auto"}
        locale={esLocale}
        firstDay={1} // Monday
        initialDate={startDate}
        validRange={{
          start: startDate,
          end: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString().split('T')[0] // Inclusive end date
        }}
        events={events}
        dateClick={onDateClick}
        editable={false}
        eventTextColor={"#000"}
      />
    </div>
  );
}
