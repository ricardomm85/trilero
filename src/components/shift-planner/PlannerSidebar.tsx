'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ShiftPlanner, StaffMember } from '@/types';
import { PlannerInfo } from './planner-info';
import HolidayManager from './HolidayManager';
import { StaffSummaryTable, EditStaffModal } from './staff';

// Default colors for new staff members (cycles through these)
const STAFF_COLORS = [
    '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
    '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
];

interface PlannerSidebarProps {
    planner: ShiftPlanner;
    onUpdate: (updatedPlanner: ShiftPlanner) => void;
}

export default function PlannerSidebar({ planner, onUpdate }: PlannerSidebarProps) {
    const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
    const [editingStaffMember, setEditingStaffMember] = useState<StaffMember | null>(null);

    const handleOpenEditStaffModal = (staffMember: StaffMember) => {
        setEditingStaffMember(staffMember);
        setIsEditStaffModalOpen(true);
    };

    const handleCloseEditStaffModal = () => {
        setEditingStaffMember(null);
        setIsEditStaffModalOpen(false);
    };

    const handleAddStaff = () => {
        const newStaff: StaffMember = {
            id: nanoid(),
            name: `Persona ${planner.staff.length + 1}`,
            color: STAFF_COLORS[planner.staff.length % STAFF_COLORS.length],
            position: planner.staff.length,
        };
        onUpdate({ ...planner, staff: [...planner.staff, newStaff] });
        // Open edit modal immediately so user can customize
        setEditingStaffMember(newStaff);
        setIsEditStaffModalOpen(true);
    };

    const handleSaveStaff = (updatedStaffMember: StaffMember) => {
        const updatedStaff = planner.staff.map(s =>
            s.id === updatedStaffMember.id ? updatedStaffMember : s
        );
        onUpdate({ ...planner, staff: updatedStaff });
    };

    const handleDeleteStaff = (staffId: string) => {
        // Remove staff member
        const updatedStaff = planner.staff
            .filter(s => s.id !== staffId)
            .map((s, index) => ({ ...s, position: index }));

        // Also remove from assignments
        const updatedAssignments = { ...planner.assignments };
        for (const date in updatedAssignments) {
            updatedAssignments[date] = updatedAssignments[date].filter(id => id !== staffId);
            if (updatedAssignments[date].length === 0) {
                delete updatedAssignments[date];
            }
        }

        onUpdate({ ...planner, staff: updatedStaff, assignments: updatedAssignments });
    };

    const handleUpdateStaffOrder = (updatedStaff: StaffMember[]) => {
        onUpdate({ ...planner, staff: updatedStaff });
    };

    return (
        <div className="space-y-8">
            <PlannerInfo planner={planner} onUpdate={onUpdate} />
            <HolidayManager planner={planner} onUpdate={onUpdate} />
            <StaffSummaryTable
                staff={planner.staff}
                assignments={planner.assignments}
                holidays={planner.holidays}
                onEditStaff={handleOpenEditStaffModal}
                onUpdateStaff={handleUpdateStaffOrder}
                onAddStaff={handleAddStaff}
            />

            <EditStaffModal
                isOpen={isEditStaffModalOpen}
                onClose={handleCloseEditStaffModal}
                staffMember={editingStaffMember}
                onSave={handleSaveStaff}
                onDelete={handleDeleteStaff}
            />
        </div>
    );
}
