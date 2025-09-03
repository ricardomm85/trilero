'use client';

import { useState, useEffect } from 'react';
import { StaffMember } from '@/types';

interface StaffSummaryTableProps {
    staff: StaffMember[];
    onEditStaff: (staffMember: StaffMember) => void;
    onUpdateStaff: (updatedStaff: StaffMember[]) => void;
}

export default function StaffSummaryTable({ staff, onEditStaff, onUpdateStaff }: StaffSummaryTableProps) {
    const [localStaff, setLocalStaff] = useState<StaffMember[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const sortedStaff = [...staff].sort((a, b) => a.position - b.position);
        setLocalStaff(sortedStaff);
    }, [staff]);

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

        const draggedItem = localStaff[draggedIndex];
        const newStaff = [...localStaff];
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal</h2>
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
                        {localStaff.map((person, index) => (
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
