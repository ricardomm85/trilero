'use client';

import { useState } from 'react';
import { StaffMember } from '@/types';
import ColorPicker from '../ColorPicker';

const defaultColor = '#3B82F6';

interface Step2StaffProps {
  staff: StaffMember[];
  onStaffChange: (staff: StaffMember[]) => void;
}

export default function Step2Staff({ staff, onStaffChange }: Step2StaffProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(defaultColor);

  const handleAddStaff = () => {
    if (name.trim() === '') return;
    const newStaffMember: StaffMember = { id: `temp-${Date.now()}`, name, color, position: staff.length };
    onStaffChange([...staff, newStaffMember]);
    setName('');
    setColor(defaultColor);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddStaff();
    }
  };

  const handleRemoveStaff = (id: string) => {
    onStaffChange(staff.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Añadir Personal</h2>
      
      <div className="p-4 border rounded-lg bg-gray-50 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre de la persona"
            className="flex-grow w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleAddStaff}
            className="w-full sm:w-auto rounded-full bg-purple-600 px-6 py-3 text-white font-bold shadow-md transition-transform hover:scale-105"
          >
            Añadir
          </button>
        </div>
        
        <div className="mt-4">
          <ColorPicker color={color} onChange={setColor} label="Elige un color" />
        </div>
      </div>

      <div className="space-y-3">
        {staff.length === 0 ? (
            <p className="text-center text-gray-500">Aún no has añadido a nadie.</p>
        ) : (
            staff.map(person => (
            <div key={person.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: person.color }}></div>
                <span className="font-medium">{person.name}</span>
                </div>
                <button
                onClick={() => handleRemoveStaff(person.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
                >
                Eliminar
                </button>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
