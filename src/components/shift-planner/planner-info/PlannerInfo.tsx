/**
 * PlannerInfo Component
 *
 * Displays the planner's basic information: name and date range.
 * Provides edit and export buttons for planner management.
 *
 * ## Features
 *
 * - **Prominent Name Display**: The planner name is shown as the main heading.
 * - **Date Range**: Start and end dates displayed in a compact format (e.g., "dic 2025 - mar 2026").
 * - **Edit Button**: Pencil icon that opens EditInfoModal for modifications.
 * - **Export Button**: Download icon that exports the planner as a JSON file.
 *
 * ## Props
 *
 * @prop {ShiftPlanner} planner - The planner object with name, startDate, endDate
 * @prop {(planner: ShiftPlanner) => void} onUpdate - Callback when planner is updated
 *
 * @example
 * <PlannerInfo
 *   planner={currentPlanner}
 *   onUpdate={(updated) => savePlanner(updated)}
 * />
 */
'use client';

import { useState } from 'react';
import { ShiftPlanner } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseDateString } from '@/utils/dates';
import { exportPlannerToFile } from '@/utils/planner';
import EditInfoModal from './EditInfoModal';

interface PlannerInfoProps {
    planner: ShiftPlanner;
    onUpdate: (updatedPlanner: ShiftPlanner) => void;
}

/**
 * Pencil icon SVG component for the edit button
 */
function PencilIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
    );
}

/**
 * Download icon SVG component for the export button
 */
function DownloadIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
    );
}

export default function PlannerInfo({ planner, onUpdate }: PlannerInfoProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const startDate = parseDateString(planner.startDate);
    const endDate = parseDateString(planner.endDate);

    // Format: "dic 2025 - mar 2026"
    const dateRange = `${format(startDate, 'MMM yyyy', { locale: es })} - ${format(endDate, 'MMM yyyy', { locale: es })}`;

    const handleExport = () => {
        exportPlannerToFile(planner);
    };

    return (
        <section>
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 truncate" title={planner.name}>
                        {planner.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {dateRange}
                    </p>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={handleExport}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                        title="Exportar planificador"
                        aria-label="Exportar planificador como archivo JSON"
                    >
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
                        title="Editar información"
                        aria-label="Editar información del planificador"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
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
