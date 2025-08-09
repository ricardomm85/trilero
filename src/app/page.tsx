'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';

const RANGE_STORAGE_KEY = 'calendarDateRange';
const EVENTS_STORAGE_KEY = 'calendarEvents';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load initial data from Local Storage on mount
  useEffect(() => {
    // Load Range
    const savedRangeJSON = localStorage.getItem(RANGE_STORAGE_KEY);
    if (savedRangeJSON) {
      const savedRange = JSON.parse(savedRangeJSON);
      if (savedRange.from && savedRange.to) {
        setRange({
          from: new Date(savedRange.from),
          to: new Date(savedRange.to),
        });
      }
    }

    // Load Events
    const savedEventsJSON = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEventsJSON) {
      setEvents(JSON.parse(savedEventsJSON));
    }

    setIsInitialLoad(false);
  }, []);

  // Save range to Local Storage whenever it changes
  useEffect(() => {
    if (isInitialLoad) return; // Don't save during initial load
    if (range?.from && range?.to) {
      localStorage.setItem(RANGE_STORAGE_KEY, JSON.stringify(range));
    }
  }, [range, isInitialLoad]);

  // Save events to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return; // Don't save during initial load
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events, isInitialLoad]);

  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt('Enter a note for this day:');
    if (title) {
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