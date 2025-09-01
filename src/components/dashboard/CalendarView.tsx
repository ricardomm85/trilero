'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarMonths, format } from 'date-fns';
import { EventInput, EventClickArg, DayCellMountArg } from '@fullcalendar/core';
import PdfExportButton from './PdfExportButton';

interface CalendarViewProps {
  selectedRange: DateRange | undefined;
  events: EventInput[];
  onDateClick: (arg: DateClickArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  specialDays: string[];
}

export default function CalendarView({ selectedRange, events, onDateClick, onEventClick, specialDays }: CalendarViewProps) {
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
      <div className="flex justify-end p-4">
        <PdfExportButton />
      </div>
      <div id="calendar-to-print">
        <FullCalendar
          key={JSON.stringify(specialDays)}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'title',
            center: '',
            right: ''
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
          eventClick={onEventClick}
          editable={false}
          dayCellDidMount={(arg: DayCellMountArg) => {
            const dayNumberEl = arg.el.querySelector('.fc-daygrid-day-number');

            if (arg.isToday) {
              arg.el.style.backgroundColor = '#ADD8E6'; // Light blue
              if (dayNumberEl) {
                (dayNumberEl as HTMLElement).style.color = '#000000';
                (dayNumberEl as HTMLElement).style.fontWeight = 'bold';
              }
            } else {
              const dayOfWeek = arg.date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 for Sunday, 6 for Saturday
                arg.el.style.backgroundColor = '#D3D3D3'; // Light gray
                if (dayNumberEl) {
                  (dayNumberEl as HTMLElement).style.fontWeight = 'bold';
                  (dayNumberEl as HTMLElement).style.color = '#000000';
                }
              }
              const month = arg.date.getMonth();
              if ((month + 1) % 2 !== 0) {
                arg.el.classList.add('day-in-odd-month');
              }

              // Highlight special days
              const dateStr = format(arg.date, 'yyyy-MM-dd');
              if (specialDays.includes(dateStr)) {
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                  arg.el.style.backgroundColor = '#FFD700'; // Gold
                  if (dayNumberEl) {
                    (dayNumberEl as HTMLElement).style.color = '#000000';
                    (dayNumberEl as HTMLElement).style.fontWeight = 'bold';
                  }
                } else {
                  if (dayNumberEl) {
                    (dayNumberEl as HTMLElement).style.color = '#000000';
                    (dayNumberEl as HTMLElement).style.fontWeight = 'bold';
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
