'use client';

import { useState, useEffect } from 'react';
import { ShiftPlanner } from '@/types';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Portal from '@/components/Portal';

interface EditInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    planner: ShiftPlanner;
    onSave: (updatedPlanner: ShiftPlanner) => void;
}

export default function EditInfoModal({ isOpen, onClose, planner, onSave }: EditInfoModalProps) {
    const [name, setName] = useState(planner.name);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(planner.startDate),
        to: new Date(planner.endDate),
    });

    useEffect(() => {
        setName(planner.name);
        setDateRange({
            from: new Date(planner.startDate),
            to: new Date(planner.endDate),
        });
    }, [planner]);

    const handleSave = () => {
        if (!dateRange?.from || !dateRange?.to) return;

        const updatedPlanner: ShiftPlanner = {
            ...planner,
            name,
            startDate: dateRange.from.toISOString().split('T')[0],
            endDate: dateRange.to.toISOString().split('T')[0],
        };
        onSave(updatedPlanner);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
                    <h2 className="text-2xl font-bold mb-6">Editar Detalles de la Planilla</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="planner-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="planner-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rango de Fechas
                        </label>
                        <div className="flex justify-center">
                            <DayPicker
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                            />
                        </div>
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
