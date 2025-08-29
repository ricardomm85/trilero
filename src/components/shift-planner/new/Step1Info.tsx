'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { DateRange } from 'react-day-picker';

interface Step1InfoProps {
  name: string;
  onNameChange: (name: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export default function Step1Info({ name, onNameChange, dateRange, onDateRangeChange }: Step1InfoProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Información de la Planilla</h2>
      <div className="mb-6">
        <label htmlFor="planner-name" className="block text-lg font-medium text-gray-600 mb-2">
          Nombre de la Planilla
        </label>
        <input
          type="text"
          id="planner-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ej: Verano 2025"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-lg font-medium text-gray-600 mb-2">
          Rango de Fechas
        </label>
        <div className="flex justify-center">
            <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            />
        </div>
      </div>
    </div>
  );
}
