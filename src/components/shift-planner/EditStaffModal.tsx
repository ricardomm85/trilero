'use client';

import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';
import Portal from '@/components/Portal';
import ColorPicker from './ColorPicker';

interface EditStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffMember: StaffMember | null;
    onSave: (updatedStaffMember: StaffMember) => void;
}

export default function EditStaffModal({ isOpen, onClose, staffMember, onSave }: EditStaffModalProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        if (staffMember) {
            setName(staffMember.name);
            setColor(staffMember.color);
        }
    }, [staffMember]);

    const handleSave = () => {
        if (!staffMember) return;

        const updatedStaffMember = {
            ...staffMember,
            name,
            color,
        };
        onSave(updatedStaffMember);
        onClose();
    };

    if (!isOpen || !staffMember) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Editar Persona</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="staff-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="staff-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-6">
                        <ColorPicker color={color} onChange={setColor} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}

