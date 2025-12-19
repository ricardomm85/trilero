'use client';

import { useState, useSyncExternalStore, useCallback } from 'react';
import Link from 'next/link';
import { ShiftPlanner } from '@/types';
import { format } from 'date-fns';
import { parseDateString } from '@/utils/dates';

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

export default function ShiftPlannerListPage() {
  const planners = usePlanners();
  const [, forceUpdate] = useState({});

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
        {/* This button is always visible */}
        <Link
          href="/shift-planner/new"
          className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white font-bold shadow-lg transition-transform hover:scale-105"
        >
          Crear Nueva Planilla
        </Link>
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
