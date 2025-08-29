'use client';

import { useState } from 'react';
import { StaffMember } from '@/types';

interface Step2StaffProps {
  staff: StaffMember[];
  onStaffChange: (staff: StaffMember[]) => void;
}

export default function Step2Staff({ staff, onStaffChange }: Step2StaffProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366F1'); // Default to a nice indigo

  const handleAddStaff = () => {
    if (name.trim() === '') return;
    // Using a temporary ID here. The final nanoid will be generated on wizard completion.
    const newStaffMember: StaffMember = { id: `temp-${Date.now()}`, name, color };
    onStaffChange([...staff, newStaffMember]);
    setName('');
    setColor('#6366F1');
  };

  const handleRemoveStaff = (id: string) => {
    onStaffChange(staff.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Añadir Personal</h2>
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la persona"
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-12 w-12 rounded-lg cursor-pointer"
        />
        <button
          onClick={handleAddStaff}
          className="rounded-full bg-purple-600 px-6 py-3 text-white font-bold shadow-md transition-transform hover:scale-105"
        >
          Añadir
        </button>
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
