'use client';

import { StaffMember } from '@/types';

interface StaffSummaryTableProps {
    staff: StaffMember[];
    onEditStaff: (staffMember: StaffMember) => void;
}

export default function StaffSummaryTable({ staff, onEditStaff }: StaffSummaryTableProps) {
    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr className="w-full h-12 text-left text-purple-700 uppercase text-sm leading-normal">
                            <th className="py-3 px-6">Nombre</th>
                            <th className="py-3 px-6">Color</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {staff.map(person => (
                            <tr 
                                key={person.id} 
                                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                onClick={() => onEditStaff(person)}
                            >
                                <td className="py-3 px-6">{person.name}</td>
                                <td className="py-3 px-6">
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
