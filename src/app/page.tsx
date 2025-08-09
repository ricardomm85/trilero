'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<EventInput[]>([]);

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt('Enter a note for this day:');
    if (title) {
      // Add a unique ID to each event
      setEvents([...events, { id: String(Date.now()), title, date: arg.dateStr }]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the note: '${clickInfo.event.title}'?`)) {
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  return (
    <main className="flex h-screen bg-white">
      <div className="w-1/4 h-full bg-gray-50 border-r p-4">
        <Sidebar selectedRange={range} onRangeChange={setRange} />
      </div>
      <div className="w-3/4 h-full p-4">
        <CalendarView 
          selectedRange={range} 
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>
    </main>
  );
}