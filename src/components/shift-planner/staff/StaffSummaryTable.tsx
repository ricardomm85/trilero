/**
 * StaffSummaryTable Component
 *
 * A reorderable table widget that displays staff members with drag-and-drop
 * functionality for sorting, click-to-edit capability, shift statistics, and an add button.
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
 * - **Shift Statistics**: Shows columns for shift counts:
 *   - L-J: Monday-Thursday shifts
 *   - Vi: Friday shifts
 *   - Sa: Saturday shifts
 *   - Do: Sunday shifts (only actual Sundays, not holidays)
 *   - Fe: Holiday shifts (days marked as holidays in the planner)
 *   - Tot: Total shifts
 *
 * - **Visual Feedback**: The row being dragged shows reduced opacity (50%) to indicate
 *   it's being moved. Staff color is shown as background on the name cell with
 *   automatic contrast text color (black/white).
 *
 * ## Implementation Details
 *
 * - Uses native HTML5 Drag and Drop API (no external libraries)
 * - Uses `useMemo` to derive sorted staff from props (sorted by `position`)
 * - Calculates shift statistics from assignments prop
 * - Holidays are counted in a separate column from Sundays
 * - Updates all `position` values after reorder to maintain contiguous ordering
 *
 * ## Props
 *
 * @prop {StaffMember[]} staff - Array of staff members to display
 * @prop {ShiftAssignments} assignments - Assignment data to calculate shift counts
 * @prop {Holiday[]} holidays - Holiday dates (counted in separate Fe column)
 * @prop {(staff: StaffMember) => void} onEditStaff - Callback when a row is clicked
 * @prop {(staff: StaffMember[]) => void} onUpdateStaff - Callback after reordering
 * @prop {() => void} onAddStaff - Callback when add button is clicked
 *
 * @example
 * <StaffSummaryTable
 *   staff={plannerStaff}
 *   assignments={planner.assignments}
 *   holidays={planner.holidays}
 *   onEditStaff={(member) => openEditModal(member)}
 *   onUpdateStaff={(newOrder) => savePlanner({ ...planner, staff: newOrder })}
 *   onAddStaff={() => openAddModal()}
 * />
 */
'use client';

import { useState, useMemo } from 'react';
import { StaffMember, ShiftAssignments, Holiday } from '@/types';

interface StaffShiftCounts {
    daily: number;  // Monday-Thursday
    friday: number;
    saturday: number;
    sunday: number;
    holiday: number;
    total: number;
}

interface StaffSummaryTableProps {
    staff: StaffMember[];
    assignments: ShiftAssignments;
    holidays: Holiday[];
    onEditStaff: (staffMember: StaffMember) => void;
    onUpdateStaff: (updatedStaff: StaffMember[]) => void;
    onAddStaff: () => void;
}

/**
 * Calculate shift counts for a staff member based on assignments
 * Holidays are counted separately from Sundays
 */
function calculateShiftCounts(staffId: string, assignments: ShiftAssignments, holidayDates: Set<string>): StaffShiftCounts {
    const counts: StaffShiftCounts = {
        daily: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
        holiday: 0,
        total: 0,
    };

    for (const dateStr in assignments) {
        if (assignments[dateStr].includes(staffId)) {
            counts.total++;

            // Holidays count separately
            if (holidayDates.has(dateStr)) {
                counts.holiday++;
                continue;
            }

            const date = new Date(dateStr);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

            if (dayOfWeek === 0) {
                counts.sunday++;
            } else if (dayOfWeek === 5) {
                counts.friday++;
            } else if (dayOfWeek === 6) {
                counts.saturday++;
            } else {
                // Monday (1) to Thursday (4)
                counts.daily++;
            }
        }
    }

    return counts;
}

/**
 * Get contrasting text color (black or white) based on background color
 */
function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default function StaffSummaryTable({ staff, assignments, holidays, onEditStaff, onUpdateStaff, onAddStaff }: StaffSummaryTableProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const sortedStaff = useMemo(
        () => [...staff].sort((a, b) => a.position - b.position),
        [staff]
    );

    const holidayDates = useMemo(
        () => new Set(holidays.map(h => h.date)),
        [holidays]
    );

    const staffCounts = useMemo(() => {
        const counts: Record<string, StaffShiftCounts> = {};
        for (const person of staff) {
            counts[person.id] = calculateShiftCounts(person.id, assignments, holidayDates);
        }
        return counts;
    }, [staff, assignments, holidayDates]);

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
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                    title="Añadir persona"
                    aria-label="Añadir persona"
                >
                    <span className="text-xl leading-none">+</span>
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Haz clic en un miembro para editarlo o arrástralo para reordenarlo.</p>
            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow text-xs">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-purple-700 uppercase">
                            <th className="py-2 px-1 w-6"></th>
                            <th className="py-2 px-2">Nombre</th>
                            <th className="py-2 px-1 text-center w-10" title="Lunes a Jueves">L-J</th>
                            <th className="py-2 px-1 text-center w-8" title="Viernes">Vi</th>
                            <th className="py-2 px-1 text-center w-8" title="Sábado">Sa</th>
                            <th className="py-2 px-1 text-center w-8" title="Domingo">Do</th>
                            <th className="py-2 px-1 text-center w-8" title="Festivos">Fe</th>
                            <th className="py-2 px-1 text-center w-8">Tot</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {sortedStaff.map((person, index) => {
                            const counts = staffCounts[person.id] || { daily: 0, friday: 0, saturday: 0, sunday: 0, holiday: 0, total: 0 };
                            return (
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
                                        className="py-2 px-1 text-center text-gray-400 cursor-grab"
                                        title="Arrastrar para reordenar"
                                    >
                                        &#x2630;
                                    </td>
                                    <td
                                        className="py-2 px-2 font-medium"
                                        style={{
                                            backgroundColor: person.color,
                                            color: getContrastColor(person.color)
                                        }}
                                    >
                                        {person.name}
                                    </td>
                                    <td className="py-2 px-1 text-center">{counts.daily}</td>
                                    <td className="py-2 px-1 text-center">{counts.friday}</td>
                                    <td className="py-2 px-1 text-center">{counts.saturday}</td>
                                    <td className="py-2 px-1 text-center">{counts.sunday}</td>
                                    <td className="py-2 px-1 text-center">{counts.holiday}</td>
                                    <td className="py-2 px-1 text-center font-semibold">{counts.total}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
