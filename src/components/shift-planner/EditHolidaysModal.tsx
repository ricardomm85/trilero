'use client';

import { useState, useEffect } from 'react';
import { ShiftPlanner, Holiday } from '@/types';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface EditHolidaysModalProps {
    isOpen: boolean;
    onClose: () => void;
    planner: ShiftPlanner;
    onSave: (updatedPlanner: ShiftPlanner) => void;
}

export default function EditHolidaysModal({ isOpen, onClose, planner, onSave }: EditHolidaysModalProps) {
    const [selectedDays, setSelectedDays] = useState<Date[]>([]);

    useEffect(() => {
        if (isOpen) {
            const holidayDates = planner.holidays.map(h => new Date(h.date));
            setSelectedDays(holidayDates);
        }
    }, [isOpen, planner.holidays]);

    const handleSave = () => {
        const updatedHolidays: Holiday[] = selectedDays.map(day => ({
            date: day.toISOString().split('T')[0],
            name: 'Festivo',
        }));

        const updatedPlanner: ShiftPlanner = {
            ...planner,
            holidays: updatedHolidays,
        };
        onSave(updatedPlanner);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Editar Días Festivos</h2>
                
                <p className="text-gray-600 mb-4 text-center">Selecciona los días festivos en el calendario.</p>
                
                <div className="flex justify-center">
                    <DayPicker
                        mode="multiple"
                        min={1}
                        selected={selectedDays}
                        onSelect={(days) => setSelectedDays(days || [])}
                        fromDate={new Date(planner.startDate)}
                        toDate={new Date(planner.endDate)}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
