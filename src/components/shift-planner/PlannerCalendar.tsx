'use client';

import { useMemo, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { ShiftPlanner } from '@/types';
import type { DateClickArg } from '@fullcalendar/interaction';
import { differenceInCalendarMonths } from 'date-fns';
import { formatDateToYYYYMMDD, parseDateString } from '@/utils/dates';
import { generateCalendarPDF } from '@/utils/calendar-pdf';
import { Spinner } from '@/components/ui';
import type { EventInput } from '@fullcalendar/core';

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
}

export default function PlannerCalendar({ planner, onDateClick }: PlannerCalendarProps) {
  const { startDate, endDate, staff, assignments, holidays } = planner;
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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
