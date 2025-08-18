
'use client';

import { useState, useEffect, useRef } from 'react';
import { Note } from '@/types';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id'>) => void;
}

const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];

export default function NewNoteModal({ isOpen, onClose, onSave }: NewNoteModalProps) {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText('');
      setSelectedColor(colors[0]);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (text) {
      onSave({ text: text.trim(), color: selectedColor });
      setText('');
      onClose();
    }
  };

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
          <h3 className="text-lg font-semibold">New Note</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Enter the note text:
          </label>
          <textarea
            ref={textareaRef}
            id="note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a background color:
          </label>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
