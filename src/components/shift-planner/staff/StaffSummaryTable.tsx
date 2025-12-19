/**
 * StaffSummaryTable Component
 *
 * A reorderable table widget that displays staff members with drag-and-drop
 * functionality for sorting, click-to-edit capability, and an add button.
 *
 * ## Features
 *
 * - **Add Staff**: Header includes a "+" button to add new staff members.
 *
 * - **Drag & Drop Reordering**: Each row has a drag handle (hamburger icon) on the left.
 *   Users can drag rows to reorder staff members. The new order is persisted via the
 *   `position` property on each StaffMember.
 *
 * - **Click to Edit**: Clicking anywhere on a row (except the drag handle during drag)
 *   triggers the `onEditStaff` callback, allowing the parent to open an edit modal
 *   where users can modify the staff member's name and color.
 *
 * - **Visual Feedback**: The row being dragged shows reduced opacity (50%) to indicate
 *   it's being moved. Rows highlight on hover to show they're interactive.
 *
 * ## Implementation Details
 *
 * - Uses native HTML5 Drag and Drop API (no external libraries)
 * - Uses `useMemo` to derive sorted staff from props (sorted by `position`)
 * - Updates all `position` values after reorder to maintain contiguous ordering
 *
 * ## Props
 *
 * @prop {StaffMember[]} staff - Array of staff members to display
 * @prop {(staff: StaffMember) => void} onEditStaff - Callback when a row is clicked
 * @prop {(staff: StaffMember[]) => void} onUpdateStaff - Callback after reordering
 * @prop {() => void} onAddStaff - Callback when add button is clicked
 *
 * @example
 * <StaffSummaryTable
 *   staff={plannerStaff}
 *   onEditStaff={(member) => openEditModal(member)}
 *   onUpdateStaff={(newOrder) => savePlanner({ ...planner, staff: newOrder })}
 *   onAddStaff={() => openAddModal()}
 * />
 */
'use client';

import { useState, useMemo } from 'react';
import { StaffMember } from '@/types';

interface StaffSummaryTableProps {
    staff: StaffMember[];
    onEditStaff: (staffMember: StaffMember) => void;
    onUpdateStaff: (updatedStaff: StaffMember[]) => void;
    onAddStaff: () => void;
}

export default function StaffSummaryTable({ staff, onEditStaff, onUpdateStaff, onAddStaff }: StaffSummaryTableProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const sortedStaff = useMemo(
        () => [...staff].sort((a, b) => a.position - b.position),
        [staff]
    );

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const draggedItem = sortedStaff[draggedIndex];
        const newStaff = [...sortedStaff];
        newStaff.splice(draggedIndex, 1);
        newStaff.splice(dropIndex, 0, draggedItem);

        const updatedStaffWithPositions = newStaff.map((s, index) => ({
            ...s,
            position: index,
        }));
        
        onUpdateStaff(updatedStaffWithPositions);
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
                <button
                    onClick={onAddStaff}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    title="Añadir persona"
                    aria-label="Añadir persona"
                >
                    <span className="text-xl leading-none">+</span>
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Haz clic en un miembro para editarlo o arrástralo para reordenarlo.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                        <tr className="w-full h-12 text-left text-purple-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 w-8"></th>
                            <th className="py-3 px-4">Nombre</th>
                            <th className="py-3 px-4">Color</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {sortedStaff.map((person, index) => (
                            <tr 
                                key={person.id} 
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                onClick={() => onEditStaff(person)}
                                className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${draggedIndex === index ? 'opacity-50' : ''}`}
                            >
                                <td 
                                    draggable
                                    onDragStart={(e) => {
                                        e.stopPropagation();
                                        handleDragStart(index);
                                    }}
                                    onDragEnd={handleDragEnd}
                                    className="py-3 px-4 text-center text-gray-400 cursor-grab" 
                                    title="Arrastrar para reordenar"
                                >
                                    &#x2630;
                                </td>
                                <td className="py-3 px-4">{person.name}</td>
                                <td className="py-3 px-4">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: person.color }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
