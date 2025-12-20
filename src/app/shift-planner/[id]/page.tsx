'use client';

import { useState, useSyncExternalStore, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ShiftPlanner } from '@/types';
import PlannerSidebar from '@/components/shift-planner/PlannerSidebar';
import PlannerCalendar from '@/components/shift-planner/PlannerCalendar';
import AssignStaffModal from '@/components/shift-planner/AssignStaffModal';
import { DateClickArg } from '@fullcalendar/interaction';

const SHIFT_PLANNERS_STORAGE_KEY = 'shiftPlanners';

function usePlanner(plannerId: string) {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    const allPlanners: ShiftPlanner[] = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
    const planner = allPlanners.find(p => p.id === plannerId);
    return planner ? JSON.stringify(planner) : null;
  }, [plannerId]);

  const getServerSnapshot = useCallback(() => null, []);

  const plannerJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return plannerJson ? JSON.parse(plannerJson) as ShiftPlanner : null;
}

export default function PlannerDetailPage() {
  const params = useParams();
  const plannerId = params.id as string;

  const planner = usePlanner(plannerId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handlePlannerUpdate = (updatedPlanner: ShiftPlanner) => {
    const allPlanners: ShiftPlanner[] = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
    const updatedPlanners = allPlanners.map(p => p.id === updatedPlanner.id ? updatedPlanner : p);
    localStorage.setItem(SHIFT_PLANNERS_STORAGE_KEY, JSON.stringify(updatedPlanners));
    // Trigger storage event for useSyncExternalStore
    window.dispatchEvent(new Event('storage'));
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate('');
  };

  const handleSaveAssignments = (selectedStaffIds: string[]) => {
    if (!planner) return;

    const updatedAssignments = { ...planner.assignments };

    if (selectedStaffIds.length === 0) {
      delete updatedAssignments[selectedDate];
    } else {
      updatedAssignments[selectedDate] = selectedStaffIds;
    }

    const updatedPlanner = { ...planner, assignments: updatedAssignments };
    handlePlannerUpdate(updatedPlanner);
  };

  if (!planner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl text-red-500">Planilla no encontrada</h1>
      </div>
    );
  }

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-50 p-6 h-screen sticky top-0 overflow-y-auto">
        <PlannerSidebar planner={planner} onUpdate={handlePlannerUpdate} />
      </aside>
      <main className="w-3/4 p-8">
        <PlannerCalendar planner={planner} onDateClick={handleDateClick} onUpdate={handlePlannerUpdate} />
      </main>
      {isModalOpen && (
        <AssignStaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAssignments}
          staff={planner.staff}
          day={selectedDate}
          assignedStaffIds={planner.assignments[selectedDate] || []}
        />
      )}
    </div>
  );
}
