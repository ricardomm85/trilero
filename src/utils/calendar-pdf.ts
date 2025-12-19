/**
 * Calendar PDF Export Utility
 *
 * Generates a PDF document from calendar data with one month per page
 * in landscape orientation.
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ShiftPlanner } from '@/types';
import { parseDateString } from '@/utils/dates';
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Month data structure for PDF generation
 */
interface MonthData {
    year: number;
    month: number; // 0-indexed
    startDate: Date;
    endDate: Date;
    title: string;
}

/**
 * Get all months in the planner's date range
 */
function getMonthsInRange(startDate: Date, endDate: Date): MonthData[] {
    const months: MonthData[] = [];
    let current = startOfMonth(startDate);
    const end = startOfMonth(endDate);

    while (current <= end) {
        months.push({
            year: current.getFullYear(),
            month: current.getMonth(),
            startDate: current,
            endDate: endOfMonth(current),
            title: format(current, 'MMMM yyyy', { locale: es }),
        });
        current = addMonths(current, 1);
    }

    return months;
}

/**
 * Create calendar HTML for a single month
 */
function createMonthCalendarHTML(
    month: MonthData,
    planner: ShiftPlanner,
    plannerStartDate: Date,
    plannerEndDate: Date
): string {
    const { staff, assignments, holidays } = planner;
    const holidayDates = new Set(holidays.map(h => h.date));

    // Get days of the week headers
    const weekDays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

    // Generate calendar grid
    const firstDayOfMonth = new Date(month.year, month.month, 1);
    const lastDayOfMonth = endOfMonth(firstDayOfMonth);

    // Get the day of week for the first day (0 = Sunday, adjust for Monday start)
    let startDayOffset = firstDayOfMonth.getDay() - 1;
    if (startDayOffset < 0) startDayOffset = 6;

    // Generate all cells (headers + days)
    const headerCells = weekDays.map(day => `<div class="header-cell">${day}</div>`).join('');

    // Generate day cells
    const dayCells: string[] = [];
    let currentDay = 1;
    const totalDays = lastDayOfMonth.getDate();

    // Calculate total cells needed (complete weeks)
    const totalCells = Math.ceil((startDayOffset + totalDays) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        const dayOfWeek = i % 7;

        if (i < startDayOffset || currentDay > totalDays) {
            // Empty cell
            dayCells.push('<div class="grid-cell empty-cell"></div>');
        } else {
            const date = new Date(month.year, month.month, currentDay);
            const dateStr = format(date, 'yyyy-MM-dd');
            const isHoliday = holidayDates.has(dateStr);
            const isOutOfRange = date < plannerStartDate || date > plannerEndDate;
            const dayAssignments = assignments[dateStr] || [];

            const cellClasses = [
                'grid-cell',
                'day-cell',
                isHoliday ? 'holiday' : '',
                isOutOfRange ? 'out-of-range' : '',
                dayOfWeek >= 5 ? 'weekend' : '',
            ].filter(Boolean).join(' ');

            let eventsHtml = '';
            if (!isOutOfRange) {
                dayAssignments.forEach(staffId => {
                    const person = staff.find(s => s.id === staffId);
                    if (person) {
                        // Width: (1060px / 7) - 8px padding - 4px margin = ~140px
                        eventsHtml += `<div class="event" style="background-color: ${person.color}; width: 140px; max-width: 140px;">${person.name}</div>`;
                    }
                });
            }

            // Height: 80px cell - 8px padding - 20px day number = ~52px for events
            dayCells.push(`
                <div class="${cellClasses}">
                    <div class="day-number">${currentDay}</div>
                    <div class="events" style="max-height: 52px; overflow: hidden;">${eventsHtml}</div>
                </div>
            `);
            currentDay++;
        }
    }

    return `
        <div class="month-calendar">
            <h1 class="month-title">${month.title}</h1>
            <div class="calendar-grid">
                ${headerCells}
                ${dayCells.join('')}
            </div>
        </div>
    `;
}

/**
 * Get CSS styles for the PDF calendar
 * Uses CSS Grid instead of table for better html2canvas compatibility
 */
function getCalendarStyles(): string {
    return `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .month-calendar {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: white;
            width: 1100px;
        }
        .month-title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 16px;
            text-transform: capitalize;
        }
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            border: 1px solid #e5e7eb;
        }
        .header-cell {
            background: #f3f4f6;
            color: #7c3aed;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px 4px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }
        .grid-cell {
            border: 1px solid #e5e7eb;
            height: 80px;
            padding: 4px;
            overflow: hidden;
            position: relative;
            clip-path: inset(0);
        }
        .empty-cell {
            background: #f9fafb;
        }
        .day-cell {
            background: white;
        }
        .day-cell.holiday {
            background: #fef3c7;
        }
        .day-cell.out-of-range {
            background: #f3f4f6;
            opacity: 0.5;
        }
        .day-cell.weekend {
            background: #f9fafb;
        }
        .day-cell.holiday.weekend {
            background: #fef3c7;
        }
        .day-number {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 4px;
        }
        .events {
            overflow: hidden;
        }
        .event {
            display: block;
            font-size: 10px;
            color: white;
            padding: 0px 4px 8px 4px;
            margin-bottom: 2px;
            border-radius: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1;
        }
    `;
}

/**
 * Generate PDF from planner data
 * Creates one landscape page per month
 */
export async function generateCalendarPDF(
    planner: ShiftPlanner,
    onProgress?: (current: number, total: number) => void
): Promise<void> {
    const startDate = parseDateString(planner.startDate);
    const endDate = parseDateString(planner.endDate);
    const months = getMonthsInRange(startDate, endDate);

    // Create PDF in landscape A4
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    // Create hidden container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            onProgress?.(i + 1, months.length);

            // Create month HTML
            const html = createMonthCalendarHTML(month, planner, startDate, endDate);
            container.innerHTML = `
                <style>${getCalendarStyles()}</style>
                ${html}
            `;

            // Wait for fonts to load
            await document.fonts.ready;

            // Capture with html2canvas
            const canvas = await html2canvas(container.querySelector('.month-calendar') as HTMLElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            // Calculate dimensions to fit A4 landscape
            const pageWidth = 297; // A4 landscape width in mm
            const pageHeight = 210; // A4 landscape height in mm
            const margin = 10;
            const maxWidth = pageWidth - (margin * 2);
            const maxHeight = pageHeight - (margin * 2);

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(maxWidth / (imgWidth / 3.78), maxHeight / (imgHeight / 3.78));

            const finalWidth = (imgWidth / 3.78) * ratio;
            const finalHeight = (imgHeight / 3.78) * ratio;

            // Center on page
            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;

            // Add new page for months after the first
            if (i > 0) {
                pdf.addPage();
            }

            // Add image to PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        }

        // Generate filename and save
        const safeName = planner.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const filename = `${safeName || 'planificador'}.pdf`;

        pdf.save(filename);
    } finally {
        // Clean up
        document.body.removeChild(container);
    }
}
