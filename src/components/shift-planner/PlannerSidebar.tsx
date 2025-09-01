'use client';

import { useState } from 'react';
import { ShiftPlanner, StaffMember } from '@/types';
import PlannerInfo from './PlannerInfo';
import HolidayManager from './HolidayManager';
import StaffSummaryTable from './StaffSummaryTable';
import EditStaffModal from './EditStaffModal';

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

    const handleSaveStaff = (updatedStaffMember: StaffMember) => {
        const updatedStaff = planner.staff.map(s =>
            s.id === updatedStaffMember.id ? updatedStaffMember : s
        );
        const updatedPlanner = { ...planner, staff: updatedStaff };
        onUpdate(updatedPlanner);
    };

    return (
        <div className="space-y-8">
            <PlannerInfo planner={planner} onUpdate={onUpdate} />
            <HolidayManager planner={planner} onUpdate={onUpdate} />
            <StaffSummaryTable staff={planner.staff} onEditStaff={handleOpenEditStaffModal} />

            <EditStaffModal
                isOpen={isEditStaffModalOpen}
                onClose={handleCloseEditStaffModal}
                staffMember={editingStaffMember}
                onSave={handleSaveStaff}
            />
        </div>
    );
}
