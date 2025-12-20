'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import type { EventInput, DayCellContentArg, EventDropArg, EventClickArg } from '@fullcalendar/core';

interface CalendarWrapperProps {
  startDate: string;
  endDate: string;
  monthCount: number;
  events: EventInput[];
  onDateClick: (arg: DateClickArg) => void;
  onEventDrop: (arg: EventDropArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
}

/**
 * Returns CSS class for day cells based on month parity
 * Odd months get a light gray background, even months stay white
 */
function getDayCellClassNames(arg: DayCellContentArg): string[] {
  const month = arg.date.getMonth(); // 0-indexed (Jan=0, Feb=1, etc.)
  return month % 2 === 1 ? ['day-in-odd-month'] : [];
}

export default function CalendarWrapper({
  startDate,
  endDate,
  monthCount,
  events,
  onDateClick,
  onEventDrop,
  onEventClick,
  onExportPdf,
  isExportingPdf,
}: CalendarWrapperProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      customButtons={{
        exportPdf: {
          text: isExportingPdf ? 'Generando...' : 'Generar PDF',
          click: () => {
            if (!isExportingPdf) {
              onExportPdf?.();
            }
          },
        },
      }}
      headerToolbar={{
        left: 'title',
        center: '',
        right: onExportPdf ? 'exportPdf' : '',
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
      firstDay={1}
      initialDate={startDate}
      validRange={{
        start: startDate,
        end: endDate
      }}
      events={events}
      dateClick={onDateClick}
      dayCellClassNames={getDayCellClassNames}
      editable={true}
      eventDurationEditable={false}
      eventDrop={onEventDrop}
      eventClick={onEventClick}
      eventTextColor={"#000"}
    />
  );
}
