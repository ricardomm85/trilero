
'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import { EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { format } from 'date-fns';
import SpecialDayModal from '@/components/SpecialDayModal';
import NewNoteModal from '@/components/NewNoteModal';
import SelectNoteModal from '@/components/SelectNoteModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import EditNoteModal from '@/components/EditNoteModal';
import { Note, DayNote } from '@/types';

const RANGE_STORAGE_KEY = 'calendarDateRange';
const NOTES_STORAGE_KEY = 'calendarNotes';
const DAY_NOTES_STORAGE_KEY = 'calendarDayNotes';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [dayNotes, setDayNotes] = useState<DayNote[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDays, setSpecialDays] = useState<string[]>([]);
  const [isSpecialDayModalOpen, setIsSpecialDayModalOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isSelectNoteModalOpen, setIsSelectNoteModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [isDeleteAllNotesModalOpen, setIsDeleteAllNotesModalOpen] = useState(false);
  const [isDeleteAllSpecialDaysModalOpen, setIsDeleteAllSpecialDaysModalOpen] = useState(false);

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

    // Load Notes
    const savedNotesJSON = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotesJSON) {
      setNotes(JSON.parse(savedNotesJSON));
    }

    // Load DayNotes
    const savedDayNotesJSON = localStorage.getItem(DAY_NOTES_STORAGE_KEY);
    if (savedDayNotesJSON) {
      setDayNotes(JSON.parse(savedDayNotesJSON));
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

  // Save notes to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes, isInitialLoad]);

  // Save dayNotes to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem(DAY_NOTES_STORAGE_KEY, JSON.stringify(dayNotes));
  }, [dayNotes, isInitialLoad]);

  // Save special days to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return; // Don't save during initial load
    localStorage.setItem('specialDays', JSON.stringify(specialDays));
  }, [specialDays, isInitialLoad]);

  // Generate events from dayNotes and notes
  useEffect(() => {
    const newEvents = dayNotes.map(dayNote => {
      const note = notes.find(n => n.id === dayNote.noteId);
      if (!note) return null;
      return {
        id: `${dayNote.date}-${dayNote.noteId}`,
        title: note.text,
        date: dayNote.date,
        backgroundColor: note.color,
        borderColor: note.color,
        textColor: 'white',
      };
    }).filter(Boolean) as EventInput[];
    setEvents(newEvents);
  }, [dayNotes, notes]);

  const addSpecialDay = (date: string) => {
    if (!specialDays.includes(date)) {
      setSpecialDays(prevDays => [...prevDays, date].sort());
    }
  };

  const removeSpecialDay = (date: string) => {
    setSpecialDays(prevDays => prevDays.filter(day => day !== date));
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
    setIsSelectNoteModalOpen(true);
  };

  const handleSaveNewNote = (note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: String(Date.now()) };
    setNotes([...notes, newNote]);
    setIsNewNoteModalOpen(false);
  };

  const handleSelectNote = (noteId: string) => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingDayNoteIndex = dayNotes.findIndex(dn => dn.date === dateStr);

      if (existingDayNoteIndex > -1) {
        // Update existing day note
        const updatedDayNotes = [...dayNotes];
        updatedDayNotes[existingDayNoteIndex] = { ...updatedDayNotes[existingDayNoteIndex], noteId };
        setDayNotes(updatedDayNotes);
      } else {
        // Create new day note
        setDayNotes([...dayNotes, { date: dateStr, noteId }]);
      }
    }
    setIsSelectNoteModalOpen(false);
    setSelectedDate(null);
  };

  const handleDeleteDayNote = () => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setDayNotes(dayNotes.filter(dn => dn.date !== dateStr));
    }
    setIsSelectNoteModalOpen(false);
    setSelectedDate(null);
  };

  const openDeleteConfirmation = (note: Note) => {
    setNoteToDelete(note);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete.id));
      setDayNotes(dayNotes.filter(dn => dn.noteId !== noteToDelete.id));
      setNoteToDelete(null);
    }
    setIsConfirmationModalOpen(false);
  };

  const openEditNoteModal = (note: Note) => {
    setNoteToEdit(note);
    setIsEditNoteModalOpen(true);
  };

  const handleEditNote = (editedNote: Note) => {
    setNotes(notes.map(n => n.id === editedNote.id ? editedNote : n));
    setNoteToEdit(null);
    setIsEditNoteModalOpen(false);
  };

  const handleDeleteAllNotes = () => {
    setNotes([]);
    setDayNotes([]);
    setIsDeleteAllNotesModalOpen(false);
  };

  const handleDeleteAllSpecialDays = () => {
    setSpecialDays([]);
    setIsDeleteAllSpecialDaysModalOpen(false);
  };

  return (
    <main className="flex flex-col md:flex-row h-screen bg-white">
      <div className="w-full md:w-1/4 h-full bg-gray-50 md:border-r p-4">
        <Sidebar
          selectedRange={range}
          onRangeChange={setRange}
          notes={notes}
          specialDays={specialDays}
          onAddSpecialDay={addSpecialDay}
          onRemoveSpecialDay={removeSpecialDay}
          onOpenSpecialDayModal={handleOpenSpecialDayModal}
          onOpenNewNoteModal={() => setIsNewNoteModalOpen(true)}
          onDeleteNote={openDeleteConfirmation}
          onEditNote={openEditNoteModal}
          onDeleteAllNotes={() => setIsDeleteAllNotesModalOpen(true)}
          onDeleteAllSpecialDays={() => setIsDeleteAllSpecialDaysModalOpen(true)}
          events={events}
        />
      </div>
      <div className="w-full md:w-3/4 h-full p-4">
        <CalendarView
          selectedRange={range}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={() => {}}
          specialDays={specialDays}
        />
      </div>
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onSave={handleSaveNewNote}
      />
      <SelectNoteModal
        isOpen={isSelectNoteModalOpen}
        onClose={() => setIsSelectNoteModalOpen(false)}
        onSelect={handleSelectNote}
        onDelete={handleDeleteDayNote}
        notes={notes}
      />
      <SpecialDayModal
        isOpen={isSpecialDayModalOpen}
        onClose={handleCloseSpecialDayModal}
        onSave={handleSaveSpecialDay}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteNote}
        title="Delete Note"
        message={`Are you sure you want to delete the note: "${noteToDelete?.text}"? This will remove the note from all assigned days.`}
      />
      <EditNoteModal
        isOpen={isEditNoteModalOpen}
        onClose={() => setIsEditNoteModalOpen(false)}
        onSave={handleEditNote}
        note={noteToEdit}
      />
      <ConfirmationModal
        isOpen={isDeleteAllNotesModalOpen}
        onClose={() => setIsDeleteAllNotesModalOpen(false)}
        onConfirm={handleDeleteAllNotes}
        title="Delete All Notes"
        message="Are you sure you want to delete all notes? This action cannot be undone."
      />
      <ConfirmationModal
        isOpen={isDeleteAllSpecialDaysModalOpen}
        onClose={() => setIsDeleteAllSpecialDaysModalOpen(false)}
        onConfirm={handleDeleteAllSpecialDays}
        title="Delete All Special Days"
        message="Are you sure you want to delete all special days? This action cannot be undone."
      />
    </main>
  );
}
