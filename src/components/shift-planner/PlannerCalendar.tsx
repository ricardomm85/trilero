'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ShiftPlanner } from '@/types';
import { EventInput } from '@fullcalendar/core';

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

  return (
    <div className="h-full w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        initialView="dayGridMonth"
        height="100%"
        firstDay={1} // Monday
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
