/**
 * AddStaffModal Component
 *
 * A modal dialog for adding one or multiple staff members at once.
 *
 * ## Features
 *
 * - **Batch Add**: Textarea allows entering multiple names separated by commas or newlines.
 * - **Shared Color**: All new staff members are created with the same selected color.
 * - **Smart Parsing**: Trims whitespace and filters empty entries automatically.
 *
 * ## Implementation Details
 *
 * - Parses textarea content by splitting on commas and newlines.
 * - Each non-empty name becomes a new StaffMember with a unique ID.
 * - All created staff members share the selected color.
 * - Renders via Portal to ensure proper z-index stacking.
 *
 * ## Props
 *
 * @prop {boolean} isOpen - Controls modal visibility
 * @prop {() => void} onClose - Callback to close the modal
 * @prop {string} defaultColor - Initial color for new staff members
 * @prop {(names: string[], color: string) => void} onAdd - Callback with parsed names and color
 *
 * @example
 * <AddStaffModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   defaultColor="#8B5CF6"
 *   onAdd={(names, color) => createStaffMembers(names, color)}
 * />
 */
'use client';

import { useState } from 'react';
import Portal from '@/components/Portal';
import ColorPicker from '../ColorPicker';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultColor: string;
    onAdd: (names: string[], color: string) => void;
}

function AddStaffModalContent({ onClose, defaultColor, onAdd }: Omit<AddStaffModalProps, 'isOpen'>) {
    const [namesText, setNamesText] = useState('');
    const [color, setColor] = useState(defaultColor);

    const handleAdd = () => {
        // Split by commas and newlines, trim whitespace, filter empty
        const names = namesText
            .split(/[,\n]/)
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (names.length === 0) return;

        onAdd(names, color);
        onClose();
    };

    const parsedCount = namesText
        .split(/[,\n]/)
        .map(name => name.trim())
        .filter(name => name.length > 0).length;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Añadir Personal</h2>

                    <div className="mb-4">
                        <label htmlFor="staff-names" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombres
                        </label>
                        <textarea
                            id="staff-names"
                            value={namesText}
                            onChange={(e) => setNamesText(e.target.value)}
                            placeholder="Escribe uno o varios nombres separados por coma o salto de línea"
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md resize-none"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {parsedCount === 0
                                ? 'Separa los nombres con comas o saltos de línea'
                                : `${parsedCount} persona${parsedCount !== 1 ? 's' : ''} a añadir`}
                        </p>
                    </div>

                    <div className="mb-6">
                        <ColorPicker color={color} onChange={setColor} />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={parsedCount === 0}
                            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}

export default function AddStaffModal({ isOpen, ...props }: AddStaffModalProps) {
    if (!isOpen) return null;
    return <AddStaffModalContent key="add-staff" {...props} />;
}
