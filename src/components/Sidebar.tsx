'use client';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { EventInput } from '@fullcalendar/core';
import NotesTable from './NotesTable';

interface SidebarProps {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  events: EventInput[];
}

export default function Sidebar({ selectedRange, onRangeChange, events }: SidebarProps) {
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
    </div>
  );
}