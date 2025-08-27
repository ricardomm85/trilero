'use client';

import { FC, useState, useEffect } from 'react';
import { Person } from '@/types';

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Person) => void;
  person: Person | null;
}

const EditPersonModal: FC<EditPersonModalProps> = ({ isOpen, onClose, onSave, person }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (person) {
      setName(person.name);
      setColor(person.color);
    }
  }, [person]);

  const handleSave = () => {
    if (person) {
      onSave({ ...person, name, color });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Person</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md"
            placeholder="Person's name"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonModal;