'use client';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { EventInput } from '@fullcalendar/core';
import NotesTable from './NotesTable';

interface SidebarProps {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  events: EventInput[];
  specialDays: string[];
  onAddSpecialDay: (date: string) => void;
  onRemoveSpecialDay: (date: string) => void;
  onOpenSpecialDayModal: () => void;
}

export default function Sidebar({ selectedRange, onRangeChange, events, specialDays, onAddSpecialDay, onRemoveSpecialDay, onOpenSpecialDayModal }: SidebarProps) {
  const handleAddSpecialDay = () => {
    onOpenSpecialDayModal();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onRangeChange}
        numberOfMonths={1}
        weekStartsOn={1} // Start week on Monday
      />
      <NotesTable events={events} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Special Days</h2>
        <button
          onClick={handleAddSpecialDay}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
        >
          Add Special Day
        </button>
        {
          specialDays.length === 0 ? (
            <p className="text-gray-500">No special days added yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {specialDays.map((day) => (
                <li key={day} className="flex justify-between items-center mb-1">
                  <span>{day}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete the special day: ${day}?`)) {
                        onRemoveSpecialDay(day);
                      }
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  );
}