
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { StaffMember } from '@/types';
import Portal from '@/components/Portal';
import { format } from 'date-fns';
import { parseDateString } from '@/utils/dates';

interface AssignStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedStaffIds: string[]) => void;
    staff: StaffMember[];
    day: string;
    assignedStaffIds: string[];
}

export default function AssignStaffModal({ isOpen, onClose, onSave, staff, day, assignedStaffIds }: AssignStaffModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(assignedStaffIds);
            // Focus the input when the modal opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100); // Small delay to ensure the element is in the DOM
        }
    }, [isOpen, assignedStaffIds]);

    const unassignedStaff = useMemo(() => 
        staff.filter(person => !selectedIds.includes(person.id))
    , [staff, selectedIds]);

    const filteredStaff = useMemo(() => 
        unassignedStaff.filter(person => 
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    , [unassignedStaff, searchTerm]);

    const assignedStaff = useMemo(() =>
        staff.filter(person => selectedIds.includes(person.id))
    , [staff, selectedIds]);

    // Reset highlight when search term or dropdown state changes
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [searchTerm, isDropdownOpen]);

    const handleSelectStaff = (staffId: string) => {
        setSelectedIds(prev => [...prev, staffId]);
        setSearchTerm('');
        setIsDropdownOpen(false);
        inputRef.current?.focus(); // Keep focus on the input
    };

    const handleRemoveStaff = (staffId: string) => {
        setSelectedIds(prev => prev.filter(id => id !== staffId));
    };

    const handleSave = () => {
        onSave(selectedIds);
        onClose();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isDropdownOpen && filteredStaff.length > 0) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % filteredStaff.length);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + filteredStaff.length) % filteredStaff.length);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (highlightedIndex > -1) {
                    handleSelectStaff(filteredStaff[highlightedIndex].id);
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Asignar Personal</h2>
                    <p className="text-gray-600 mb-6">Para el día: <span className="font-semibold">{format(parseDateString(day), 'dd/MM/yyyy')}</span></p>

                    <div className="relative mb-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                            placeholder="Buscar personal para añadir..."
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                        />
                        {isDropdownOpen && searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((person, index) => (
                                        <div
                                            key={person.id}
                                            onClick={() => handleSelectStaff(person.id)}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            className={`flex items-center gap-3 p-3 cursor-pointer ${index === highlightedIndex ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                                        >
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: person.color }}></div>
                                            <span>{person.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-500">No se encontraron resultados.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-700">Personal Asignado:</h3>
                        {assignedStaff.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Nadie asignado a este día.</p>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {assignedStaff.map(person => (
                                    <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: person.color }}></div>
                                            <span className="font-medium">{person.name}</span>
                                        </div>
                                        <button onClick={() => handleRemoveStaff(person.id)} className="text-sm text-red-500 hover:text-red-700 font-semibold">
                                            Quitar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button onClick={onClose} className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
