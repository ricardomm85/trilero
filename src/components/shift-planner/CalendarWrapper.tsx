'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import type { EventInput } from '@fullcalendar/core';

interface CalendarWrapperProps {
  startDate: string;
  endDate: string;
  monthCount: number;
  events: EventInput[];
  onDateClick: (arg: DateClickArg) => void;
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
}

export default function CalendarWrapper({
  startDate,
  endDate,
  monthCount,
  events,
  onDateClick,
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
      editable={false}
      eventTextColor={"#000"}
    />
  );
}
