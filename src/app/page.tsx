'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import NoteModal from '@/components/NoteModal';
import { EventInput, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { format } from 'date-fns';
import SpecialDayModal from '@/components/SpecialDayModal';

const RANGE_STORAGE_KEY = 'calendarDateRange';
const EVENTS_STORAGE_KEY = 'calendarEvents';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventInput | null>(null);
  const [specialDays, setSpecialDays] = useState<string[]>([]);
  const [isSpecialDayModalOpen, setIsSpecialDayModalOpen] = useState(false);

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

    // Load Special Days
    const savedSpecialDaysJSON = localStorage.getItem('specialDays');
    if (savedSpecialDaysJSON) {
      setSpecialDays(JSON.parse(savedSpecialDaysJSON));
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

  // Save special days to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return; // Don't save during initial load
    localStorage.setItem('specialDays', JSON.stringify(specialDays));
  }, [specialDays, isInitialLoad]);

  const addSpecialDay = (date: string) => {
    if (!specialDays.includes(date)) {
      setSpecialDays((prevDays) => [...prevDays, date].sort());
    }
  };

  const removeSpecialDay = (date: string) => {
    setSpecialDays((prevDays) => prevDays.filter((day) => day !== date));
  };

  const handleOpenSpecialDayModal = () => {
    setIsSpecialDayModalOpen(true);
  };

  const handleCloseSpecialDayModal = () => {
    setIsSpecialDayModalOpen(false);
  };

  const handleSaveSpecialDay = (date: string) => {
    addSpecialDay(date);
    setIsSpecialDayModalOpen(false);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setEditingEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start || undefined,
      end: clickInfo.event.end || undefined,
      allDay: clickInfo.event.allDay,
      backgroundColor: clickInfo.event.backgroundColor,
      borderColor: clickInfo.event.borderColor,
      textColor: clickInfo.event.textColor,
    });
    setSelectedDate(clickInfo.event.start);
    setIsModalOpen(true);
  };

  const handleSaveNote = (note: string, color: string) => {
    if (editingEvent) {
      // Update existing event
      setEvents(
        events.map(event =>
          event.id === editingEvent.id
            ? { ...event, title: note, backgroundColor: color, borderColor: color }
            : event
        )
      );
    } else if (selectedDate) {
      // Create new event
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
    setEditingEvent(null);
  };

  const handleDeleteNote = () => {
    if (editingEvent) {
      setEvents(events.filter(event => event.id !== editingEvent.id));
      setIsModalOpen(false);
      setSelectedDate(null);
      setEditingEvent(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  }

  return (
    <main className="flex flex-col md:flex-row h-screen bg-white">
      <div className="w-full md:w-1/4 h-full bg-gray-50 md:border-r p-4">
        <Sidebar selectedRange={range} onRangeChange={setRange} events={events} specialDays={specialDays} onAddSpecialDay={addSpecialDay} onRemoveSpecialDay={removeSpecialDay} onOpenSpecialDayModal={handleOpenSpecialDayModal} />
      </div>
      <div className="w-full md:w-3/4 h-full p-4">
        <CalendarView
          selectedRange={range}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          specialDays={specialDays}
        />
      </div>
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        selectedDate={selectedDate}
        event={editingEvent}
      />
      <SpecialDayModal
        isOpen={isSpecialDayModalOpen}
        onClose={handleCloseSpecialDayModal}
        onSave={handleSaveSpecialDay}
      />
    </main>
  );
}