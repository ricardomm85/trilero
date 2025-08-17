'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface SpecialDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
}

export default function SpecialDayModal({ isOpen, onClose, onSave }: SpecialDayModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedDate) {
      onSave(format(selectedDate, 'yyyy-MM-dd'));
      setSelectedDate(undefined); // Reset for next time
      onClose();
    } else {
      alert('Please select a date.');
    }
  };

  const handleClose = () => {
    setSelectedDate(undefined); // Reset for next time
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Select Special Day</h2>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          weekStartsOn={1} // Start week on Monday
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
