'use client';

import { useState } from 'react';
import { ShiftPlanner } from '@/types';
import { format } from 'date-fns';
import { parseDateString } from '@/utils/dates';
import EditInfoModal from './EditInfoModal';

interface PlannerInfoProps {
    planner: ShiftPlanner;
    onUpdate: (updatedPlanner: ShiftPlanner) => void;
}

export default function PlannerInfo({ planner, onUpdate }: PlannerInfoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Detalles</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                    Editar
                </button>
            </div>
            <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Nombre:</span> {planner.name}</p>
                <p><span className="font-semibold">Desde:</span> {format(parseDateString(planner.startDate), 'dd/MM/yyyy')}</p>
                <p><span className="font-semibold">Hasta:</span> {format(parseDateString(planner.endDate), 'dd/MM/yyyy')}</p>
                {planner.creationDate && (
                    <p><span className="font-semibold">Creado:</span> {format(new Date(planner.creationDate), 'dd/MM/yyyy')}</p>
                )}
            </div>

            <EditInfoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                planner={planner}
                onSave={onUpdate}
            />
        </section>
    );
}
