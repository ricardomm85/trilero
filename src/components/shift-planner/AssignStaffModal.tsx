
'use client';

import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';

interface AssignStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedStaffIds: string[]) => void;
    staff: StaffMember[];
    day: string;
    assignedStaffIds: string[];
}

export default function AssignStaffModal({ isOpen, onClose, onSave, staff, day, assignedStaffIds }: AssignStaffModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(assignedStaffIds);
        }
    }, [isOpen, assignedStaffIds]);

    const handleToggleStaff = (staffId: string) => {
        setSelectedIds(prev =>
            prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
        );
    };

    const handleSave = () => {
        onSave(selectedIds);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Asignar Personal</h2>
                <p className="text-gray-600 mb-6">Para el día: <span className="font-semibold">{new Date(day).toLocaleDateString()}</span></p>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {staff.map(person => (
                        <div
                            key={person.id}
                            onClick={() => handleToggleStaff(person.id)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedIds.includes(person.id) ? 'ring-2 ring-purple-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: person.color }}></div>
                                <span className="font-medium text-gray-700">{person.name}</span>
                            </div>
                            <input
                                type="checkbox"
                                readOnly
                                checked={selectedIds.includes(person.id)}
                                className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
