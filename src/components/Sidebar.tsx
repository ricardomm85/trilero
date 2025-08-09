'use client';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface SidebarProps {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
}

export default function Sidebar({ selectedRange, onRangeChange }: SidebarProps) {
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
    </div>
  );
}