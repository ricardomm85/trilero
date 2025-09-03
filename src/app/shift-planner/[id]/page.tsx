'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShiftPlanner } from '@/types';
import PlannerSidebar from '@/components/shift-planner/PlannerSidebar';
import PlannerCalendar from '@/components/shift-planner/PlannerCalendar';
import AssignStaffModal from '@/components/shift-planner/AssignStaffModal';
import { DateClickArg } from '@fullcalendar/interaction';

const SHIFT_PLANNERS_STORAGE_KEY = 'shiftPlanners';

export default function PlannerDetailPage() {
  const params = useParams();
  const plannerId = params.id as string;

  const [planner, setPlanner] = useState<ShiftPlanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!plannerId) return;

    const allPlanners: ShiftPlanner[] = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
    const currentPlanner = allPlanners.find(p => p.id === plannerId);

    if (currentPlanner) {
      setPlanner(currentPlanner);
    }
    setIsLoading(false);
  }, [plannerId]);

  const handlePlannerUpdate = (updatedPlanner: ShiftPlanner) => {
    setPlanner(updatedPlanner);
    const allPlanners: ShiftPlanner[] = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
    const updatedPlanners = allPlanners.map(p => p.id === updatedPlanner.id ? updatedPlanner : p);
    localStorage.setItem(SHIFT_PLANNERS_STORAGE_KEY, JSON.stringify(updatedPlanners));
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
        <PlannerCalendar planner={planner} onDateClick={handleDateClick} />
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
