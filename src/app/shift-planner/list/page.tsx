'use client';

import { useState, useSyncExternalStore, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ShiftPlanner } from '@/types';
import { format } from 'date-fns';
import { parseDateString } from '@/utils/dates';
import { importPlannerFromJson, readFileAsText } from '@/utils/planner';

const SHIFT_PLANNERS_STORAGE_KEY = 'shiftPlanners';

function usePlanners() {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]';
  }, []);

  const getServerSnapshot = useCallback(() => '[]', []);

  const plannersJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return JSON.parse(plannersJson) as ShiftPlanner[];
}

/**
 * Upload icon SVG component for the import button
 */
function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
}

export default function ShiftPlannerListPage() {
  const planners = usePlanners();
  const [, forceUpdate] = useState({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const jsonString = await readFileAsText(file);
      const newPlanner = importPlannerFromJson(jsonString);

      // Add to existing planners
      const currentPlanners = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
      const updatedPlanners = [...currentPlanners, newPlanner];
      localStorage.setItem(SHIFT_PLANNERS_STORAGE_KEY, JSON.stringify(updatedPlanners));
      window.dispatchEvent(new Event('storage'));
      forceUpdate({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      window.alert(`Error al importar: ${message}`);
    }

    // Reset file input so the same file can be imported again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (plannerId: string) => {
    if (window.confirm('¿Estás seguro de que quieres borrar esta planilla?')) {
      const updatedPlanners = planners.filter(p => p.id !== plannerId);
      localStorage.setItem(SHIFT_PLANNERS_STORAGE_KEY, JSON.stringify(updatedPlanners));
      window.dispatchEvent(new Event('storage'));
      forceUpdate({});
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Mis Planillas</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full bg-white border-2 border-purple-500 px-4 py-2.5 text-purple-600 font-semibold shadow-md transition-all hover:bg-purple-50 hover:scale-105 cursor-pointer"
            title="Importar planilla desde archivo JSON"
            aria-label="Importar planilla desde archivo JSON"
          >
            <UploadIcon className="w-5 h-5" />
            <span>Importar</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            aria-hidden="true"
          />
          <Link
            href="/shift-planner/new"
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white font-bold shadow-lg transition-transform hover:scale-105"
          >
            Crear Nueva Planilla
          </Link>
        </div>
      </div>

      {planners.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No tienes planillas de turnos.</h2>
          <p className="text-gray-500 mb-6">Empieza creando tu primera planilla.</p>
          {/* The prominent CTA for the empty state */}
          <Link
            href="/shift-planner/new"
            className="inline-block rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-8 py-4 text-white font-bold shadow-lg transition-transform hover:scale-105"
          >
            Crear mi primera planilla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planners.map((planner) => (
            <div key={planner.id} className="bg-white rounded-lg shadow-lg flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <Link href={`/shift-planner/${planner.id}`} className="block p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{planner.name}</h3>
                    <p className="text-gray-600">
                        {format(parseDateString(planner.startDate), 'dd/MM/yyyy')} - {format(parseDateString(planner.endDate), 'dd/MM/yyyy')}
                    </p>
                    <p className="text-gray-500 mt-2">{planner.staff.length} personas</p>
                    {planner.creationDate && (
                        <p className="text-sm text-gray-400 mt-4">
                            Creado el: {format(new Date(planner.creationDate), 'dd/MM/yyyy')}
                        </p>
                    )}
                </Link>
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <Link href={`/shift-planner/${planner.id}`} className="text-purple-600 font-semibold hover:underline">
                        Ver Planilla &rarr;
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Stop link navigation
                            handleDelete(planner.id);
                        }}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Borrar
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
