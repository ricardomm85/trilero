
'use client';

import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Person } from '@/types';
import PersonsTable from './PersonsTable';
import { EventInput } from '@fullcalendar/core';

interface SidebarProps {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  persons: Person[];
  specialDays: string[];
  onRemoveSpecialDay: (date: string) => void;
  onOpenSpecialDayModal: () => void;
  onOpenNewPersonModal: () => void;
  onDeletePerson: (person: Person) => void;
  onEditPerson: (person: Person) => void;
  events: EventInput[];
}

export default function Sidebar({ selectedRange, onRangeChange, persons, specialDays, onRemoveSpecialDay, onOpenSpecialDayModal, onOpenNewPersonModal, onDeletePerson, onEditPerson, events }: SidebarProps) {
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

      <PersonsTable events={events} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Persons</h2>
        <button
          onClick={onOpenNewPersonModal}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
        >
          New Person
        </button>
        {
          persons.length === 0 ? (
            <p className="text-gray-500">No persons created yet.</p>
          ) : (
            <ul className="space-y-2">
              {persons.map((person) => (
                <li key={person.id} className="flex justify-between items-center p-2 rounded-md" style={{ backgroundColor: person.color, color: 'white' }}>
                  <span>{person.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditPerson(person)}
                      className="ml-2 text-white hover:text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePerson(person)}
                      className="ml-2 text-white hover:text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </div>

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
              ))
            }
            </ul>
          )
        }
      </div>
    </div>
  );
}
