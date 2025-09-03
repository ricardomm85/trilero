'use client';

import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { parseDateString, formatDateToYYYYMMDD } from '@/utils/dates';
import { Holiday } from '@/types';

interface Step3HolidaysProps {
  dateRange: DateRange | undefined;
  holidays: Holiday[];
  onHolidaysChange: (holidays: Holiday[]) => void;
}

export default function Step3Holidays({ dateRange, holidays, onHolidaysChange }: Step3HolidaysProps) {
  const holidayDates = holidays.map(h => parseDateString(h.date));

  const handleDayClick = (day: Date) => {
    const dateStr = formatDateToYYYYMMDD(day);
    const isHoliday = holidays.some(h => h.date === dateStr);

    let updatedHolidays;
    if (isHoliday) {
      updatedHolidays = holidays.filter(h => h.date !== dateStr);
    } else {
      updatedHolidays = [...holidays, { date: dateStr, name: 'Festivo' }];
    }
    onHolidaysChange(updatedHolidays);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Seleccionar Días Festivos</h2>
      <p className="text-gray-600 mb-4 text-center">Haz clic en los días del calendario para marcarlos como festivos.</p>
      <div className="flex justify-center">
        <DayPicker
          locale={es}
          mode="multiple"
          fromDate={dateRange?.from}
          toDate={dateRange?.to}
          selected={holidayDates}
          onDayClick={handleDayClick}
          disabled={!dateRange?.from || !dateRange?.to}
        />
      </div>
       {holidays.length > 0 && (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Días festivos seleccionados:</h3>
            <ul className="list-disc list-inside">
                {holidays.sort((a, b) => a.date.localeCompare(b.date)).map(h => <li key={h.date}>{format(parseDateString(h.date), 'dd/MM/yyyy')}</li>)}
            </ul>
        </div>
       )}
    </div>
  );
}
