'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarMonths } from 'date-fns';
import { EventInput } from '@fullcalendar/core';

interface CalendarViewProps {
  selectedRange: DateRange | undefined;
  events: EventInput[];
  onDateClick: (arg: DateClickArg) => void;
}

export default function CalendarView({ selectedRange, events, onDateClick }: CalendarViewProps) {
  if (!selectedRange?.from || !selectedRange?.to) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">Please select a start and end date to display the calendar.</p>
      </div>
    );
  }

  const monthCount = differenceInCalendarMonths(selectedRange.to, selectedRange.from) + 1;

  return (
    <div className="h-full overflow-y-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today'
        }}
        initialDate={selectedRange.from}
        validRange={{
          start: selectedRange.from,
          end: selectedRange.to
        }}
        views={{
          multiMonth: {
            type: 'dayGrid',
            duration: { months: monthCount > 0 ? monthCount : 1 },
          }
        }}
        initialView={'multiMonth'}
        height={'auto'}
        firstDay={1}
        events={events}
        dateClick={onDateClick}
        editable={true} // Allows events to be dragged and resized
      />
    </div>
  );
}
