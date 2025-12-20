'use client';

import { useMemo, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { ShiftPlanner } from '@/types';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventInput, EventDropArg } from '@fullcalendar/core';
import { differenceInCalendarMonths, format } from 'date-fns';
import { formatDateToYYYYMMDD, parseDateString } from '@/utils/dates';
import { generateCalendarPDF } from '@/utils/calendar-pdf';
import { Spinner } from '@/components/ui';

const CalendarWrapper = dynamic(
  () => import('./CalendarWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    ),
  }
);

interface PlannerCalendarProps {
  planner: ShiftPlanner;
  onDateClick: (arg: DateClickArg) => void;
  onUpdate: (planner: ShiftPlanner) => void;
}

export default function PlannerCalendar({ planner, onDateClick, onUpdate }: PlannerCalendarProps) {
  const { startDate, endDate, staff, assignments, holidays } = planner;
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleEventDrop = useCallback((arg: EventDropArg) => {
    const eventId = arg.event.id;
    // Event ID format: "YYYY-MM-DD::staffId" (using :: as separator to avoid conflicts with IDs containing dashes)
    const separatorIndex = eventId.indexOf('::');
    if (separatorIndex === -1) return; // Invalid format, ignore
    const oldDate = eventId.substring(0, separatorIndex);
    const staffId = eventId.substring(separatorIndex + 2);
    const newDate = format(arg.event.start!, 'yyyy-MM-dd');

    if (oldDate === newDate) return;

    const updatedAssignments = { ...assignments };

    // Remove from old date
    if (updatedAssignments[oldDate]) {
      updatedAssignments[oldDate] = updatedAssignments[oldDate].filter(id => id !== staffId);
      if (updatedAssignments[oldDate].length === 0) {
        delete updatedAssignments[oldDate];
      }
    }

    // Add to new date
    if (!updatedAssignments[newDate]) {
      updatedAssignments[newDate] = [];
    }
    if (!updatedAssignments[newDate].includes(staffId)) {
      updatedAssignments[newDate].push(staffId);
    }

    onUpdate({ ...planner, assignments: updatedAssignments });
  }, [assignments, planner, onUpdate]);

  const handleExportPdf = useCallback(async () => {
    if (isExportingPdf) return;

    setIsExportingPdf(true);
    try {
      await generateCalendarPDF(planner);
    } catch (error) {
      console.error('Error generating PDF:', error);
      window.alert('Error al generar el PDF');
    } finally {
      setIsExportingPdf(false);
    }
  }, [planner, isExportingPdf]);

  const events: EventInput[] = useMemo(() => {
    const eventList: EventInput[] = Object.entries(assignments).flatMap(([date, staffIds]) =>
      staffIds
        .filter(staffId => staff.some(s => s.id === staffId)) // Filter out orphan assignments
        .map(staffId => {
          const person = staff.find(s => s.id === staffId)!;
          return {
            id: `${date}::${staffId}`,
            title: person.name,
            date,
            backgroundColor: person.color,
            borderColor: person.color,
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
        onEventDrop={handleEventDrop}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
      />

      {isExportingPdf && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <Spinner />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">Generando PDF...</p>
              <p className="text-sm text-gray-500 mt-1">Esto puede tardar unos segundos.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
