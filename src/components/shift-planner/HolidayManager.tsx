'use client';

import { useState } from 'react';
import { ShiftPlanner } from '@/types';
import EditHolidaysModal from './EditHolidaysModal';

interface HolidayManagerProps {
    planner: ShiftPlanner;
    onUpdate: (updatedPlanner: ShiftPlanner) => void;
}

export default function HolidayManager({ planner, onUpdate }: HolidayManagerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Días Festivos</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                    Editar
                </button>
            </div>
            <p className="text-gray-700">{planner.holidays.length} días festivos</p>

            <EditHolidaysModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                planner={planner}
                onSave={onUpdate}
            />
        </section>
    );
}
