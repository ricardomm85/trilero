'use client';

import { Person } from '@/types';

interface SelectPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (personId: string) => void;
  onDelete: () => void;
  persons: Person[];
}

export default function SelectPersonModal({ isOpen, onClose, onSelect, onDelete, persons }: SelectPersonModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select a Person</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="space-y-2">
          {persons.map(person => (
            <div
              key={person.id}
              onClick={() => onSelect(person.id)}
              className="p-3 rounded-md cursor-pointer hover:bg-gray-100 border"
              style={{ backgroundColor: person.color, color: 'white' }}
            >
              {person.name}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Delete Person for this Day
          </button>
        </div>
      </div>
    </div>
  );
}