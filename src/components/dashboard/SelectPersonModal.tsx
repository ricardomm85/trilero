'use client';

import { FC } from 'react';
import { Person } from '@/types';

interface SelectPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (personId: string) => void;
  onDelete: () => void;
  persons: Person[];
}

const SelectPersonModal: FC<SelectPersonModalProps> = ({ isOpen, onClose, onSelect, onDelete, persons }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Select Person</h2>
        <div className="flex flex-col gap-2">
          {persons.map(person => (
            <button
              key={person.id}
              onClick={() => onSelect(person.id)}
              className="p-2 border rounded-md text-left"
              style={{ backgroundColor: person.color, color: 'white' }}
            >
              {person.name}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Delete Assignment</button>
        </div>
      </div>
    </div>
  );
};

export default SelectPersonModal;