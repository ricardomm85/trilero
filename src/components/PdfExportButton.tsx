'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DateRange } from 'react-day-picker';
import { EventInput } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { addMonths, differenceInCalendarMonths, format, startOfMonth } from 'date-fns';
import { createRoot } from 'react-dom/client';

interface PdfExportButtonProps {
  selectedRange: DateRange | undefined;
  events: EventInput[];
  specialDays: string[];
}

const PdfExportButton = ({ selectedRange, events, specialDays }: PdfExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      return;
    }

    setIsExporting(true);

    const pdf = new jsPDF('l', 'mm', 'a4');
    const monthCount = differenceInCalendarMonths(selectedRange.to, selectedRange.from) + 1;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    const root = createRoot(tempContainer);

    for (let i = 0; i < monthCount; i++) {
      const date = addMonths(startOfMonth(selectedRange.from), i);

      const calendarEl = (
        <div style={{ width: '297mm', height: '210mm', padding: '20px' }}>
          <FullCalendar
            key={date.toString()}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={date}
            events={events}
            height="auto"
            firstDay={1}
            headerToolbar={{
              left: 'title',
              center: '',
              right: ''
            }}
            dayCellDidMount={(arg) => {
              const dayOfWeek = arg.date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                const dayNumberEl = arg.el.querySelector('.fc-daygrid-day-number');
                if (dayNumberEl) {
                  (dayNumberEl as HTMLElement).style.fontWeight = 'bold';
                  (dayNumberEl as HTMLElement).style.color = '#FF0000';
                }
              }
              const month = arg.date.getMonth();
              if ((month + 1) % 2 !== 0) {
                arg.el.classList.add('day-in-odd-month');
              }
              const dateStr = format(arg.date, 'yyyy-MM-dd');
              if (specialDays.includes(dateStr)) {
                arg.el.style.backgroundColor = '#FFFACD';
              }
            }}
          />
        </div>
      );

      await new Promise<void>((resolve) => {
        root.render(calendarEl);
        setTimeout(async () => {
          const canvas = await html2canvas(tempContainer, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          resolve();
        }, 500);
      });
    }

    root.unmount();
    document.body.removeChild(tempContainer);
    pdf.save('calendar.pdf');
    setIsExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isExporting}
    >
      {isExporting ? 'Exporting...' : 'Export to PDF'}
    </button>
  );
};

export default PdfExportButton;