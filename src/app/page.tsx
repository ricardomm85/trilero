'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import NoteModal from '@/components/NoteModal';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { format } from 'date-fns';

const RANGE_STORAGE_KEY = 'calendarDateRange';
const EVENTS_STORAGE_KEY = 'calendarEvents';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the note: '${clickInfo.event.title}'?`)) {
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  const handleSaveNote = (note: string, color: string) => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setEvents([
        ...events,
        {
          id: String(Date.now()),
          title: note,
          date: dateStr,
          backgroundColor: color,
          borderColor: color,
        },
      ]);
    }
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <main className="flex h-screen bg-white">
      <div className="w-1/4 h-full bg-gray-50 border-r p-4">
        <Sidebar selectedRange={range} onRangeChange={setRange} events={events} />
      </div>
      <div className="w-3/4 h-full p-4">
        <CalendarView
          selectedRange={range}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        selectedDate={selectedDate}
      />
    </main>
  );
}