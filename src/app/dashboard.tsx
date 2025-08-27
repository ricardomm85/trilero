
'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Sidebar from '@/components/dashboard/Sidebar';
import CalendarView from '@/components/dashboard/CalendarView';
import { EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { format } from 'date-fns';
import SpecialDayModal from '@/components/dashboard/SpecialDayModal';
import NewPersonModal from '@/components/dashboard/NewPersonModal';
import SelectPersonModal from '@/components/dashboard/SelectPersonModal';
import ConfirmationModal from '@/components/dashboard/ConfirmationModal';
import EditPersonModal from '@/components/dashboard/EditPersonModal';
import { Person, DayPerson } from '@/types';
import { nanoid } from 'nanoid';

const RANGE_STORAGE_KEY = 'calendarDateRange';
const PERSONS_STORAGE_KEY = 'calendarPersons';
const DAY_PERSONS_STORAGE_KEY = 'calendarDayPersons';

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [persons, setPersons] = useState<Person[]>([]);
  const [dayPersons, setDayPersons] = useState<DayPerson[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDays, setSpecialDays] = useState<string[]>([]);
  const [isSpecialDayModalOpen, setIsSpecialDayModalOpen] = useState(false);
  const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);
  const [isSelectPersonModalOpen, setIsSelectPersonModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);

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

    // Load Persons
    const savedPersonsJSON = localStorage.getItem(PERSONS_STORAGE_KEY);
    if (savedPersonsJSON) {
      setPersons(JSON.parse(savedPersonsJSON));
    }

    // Load DayPersons
    const savedDayPersonsJSON = localStorage.getItem(DAY_PERSONS_STORAGE_KEY);
    if (savedDayPersonsJSON) {
      setDayPersons(JSON.parse(savedDayPersonsJSON));
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

  // Save persons to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem(PERSONS_STORAGE_KEY, JSON.stringify(persons));
  }, [persons, isInitialLoad]);

  // Save dayPersons to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem(DAY_PERSONS_STORAGE_KEY, JSON.stringify(dayPersons));
  }, [dayPersons, isInitialLoad]);

  // Save special days to Local Storage whenever they change
  useEffect(() => {
    if (isInitialLoad) return; // Don't save during initial load
    localStorage.setItem('specialDays', JSON.stringify(specialDays));
  }, [specialDays, isInitialLoad]);

  // Generate events from dayPersons and persons
  useEffect(() => {
    const newEvents = dayPersons.map(dayPerson => {
      const person = persons.find(p => p.id === dayPerson.personId);
      if (!person) return null;
      return {
        id: `${dayPerson.date}-${dayPerson.personId}`,
        title: person.name,
        date: dayPerson.date,
        backgroundColor: person.color,
        borderColor: person.color,
        textColor: 'white',
      };
    }).filter(Boolean) as EventInput[];
    setEvents(newEvents);
  }, [dayPersons, persons]);

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
    setIsSelectPersonModalOpen(true);
  };

  const handleSaveNewPerson = (person: Omit<Person, 'id'>) => {
    const newPerson = { ...person, id: nanoid() };
    setPersons(prevPersons => [...prevPersons, newPerson]);
    setIsNewPersonModalOpen(false);
  };

  const handleSelectPerson = (personId: string) => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const existingDayPersonIndex = dayPersons.findIndex(dp => dp.date === dateStr);

      if (existingDayPersonIndex > -1) {
        // Update existing day person
        const updatedDayPersons = [...dayPersons];
        updatedDayPersons[existingDayPersonIndex] = { ...updatedDayPersons[existingDayPersonIndex], personId };
        setDayPersons(updatedDayPersons);
      } else {
        // Create new day person
        setDayPersons([...dayPersons, { date: dateStr, personId }]);
      }
    }
    setIsSelectPersonModalOpen(false);
    setSelectedDate(null);
  };

  const handleDeleteDayPerson = () => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setDayPersons(dayPersons.filter(dp => dp.date !== dateStr));
    }
    setIsSelectPersonModalOpen(false);
    setSelectedDate(null);
  };

  const openDeleteConfirmation = (person: Person) => {
    setPersonToDelete(person);
    setIsConfirmationModalOpen(true);
  };

  const handleDeletePerson = () => {
    if (personToDelete) {
      setPersons(persons.filter(p => p.id !== personToDelete.id));
      setDayPersons(dayPersons.filter(dp => dp.personId !== personToDelete.id));
      setPersonToDelete(null);
    }
    setIsConfirmationModalOpen(false);
  };

  const openEditPersonModal = (person: Person) => {
    setPersonToEdit(person);
    setIsEditPersonModalOpen(true);
  };

  const handleEditPerson = (editedPerson: Person) => {
    setPersons(persons.map(p => p.id === editedPerson.id ? editedPerson : p));
    setPersonToEdit(null);
    setIsEditPersonModalOpen(false);
  };

  return (
    <main className="flex flex-col md:flex-row h-screen bg-white">
      <div className="w-full md:w-1/4 h-full bg-gray-50 md:border-r p-4">
        <Sidebar
          selectedRange={range}
          onRangeChange={setRange}
          persons={persons}
          specialDays={specialDays}
          onRemoveSpecialDay={removeSpecialDay}
          onOpenSpecialDayModal={handleOpenSpecialDayModal}
          onOpenNewPersonModal={() => setIsNewPersonModalOpen(true)}
          onDeletePerson={openDeleteConfirmation}
          onEditPerson={openEditPersonModal}
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
      <NewPersonModal
        isOpen={isNewPersonModalOpen}
        onClose={() => setIsNewPersonModalOpen(false)}
        onSave={handleSaveNewPerson}
      />
      <SelectPersonModal
        isOpen={isSelectPersonModalOpen}
        onClose={() => setIsSelectPersonModalOpen(false)}
        onSelect={handleSelectPerson}
        onDelete={handleDeleteDayPerson}
        persons={persons}
      />
      <SpecialDayModal
        isOpen={isSpecialDayModalOpen}
        onClose={handleCloseSpecialDayModal}
        onSave={handleSaveSpecialDay}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeletePerson}
        title="Delete Person"
        message={`Are you sure you want to delete the person: "${personToDelete?.name}"? This will remove the person from all assigned days.`}
      />
      <EditPersonModal
        isOpen={isEditPersonModalOpen}
        onClose={() => setIsEditPersonModalOpen(false)}
        onSave={handleEditPerson}
        person={personToEdit}
      />
    </main>
  );
}
