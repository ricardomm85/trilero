/**
 * Planner Utility Functions
 *
 * Provides utilities for exporting and importing shift planners as JSON files.
 */
import { ShiftPlanner, StaffMember, Holiday, ShiftAssignments } from '@/types';
import { nanoid } from 'nanoid';

/**
 * Validates that an object has the required ShiftPlanner structure.
 * Returns the validated planner or throws an error.
 */
export function validatePlannerStructure(data: unknown): Omit<ShiftPlanner, 'id' | 'creationDate'> {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid data: expected an object');
    }

    const obj = data as Record<string, unknown>;

    // Required string fields
    if (typeof obj.name !== 'string' || obj.name.trim() === '') {
        throw new Error('Invalid planner: missing or empty name');
    }
    if (typeof obj.startDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(obj.startDate)) {
        throw new Error('Invalid planner: startDate must be in YYYY-MM-DD format');
    }
    if (typeof obj.endDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(obj.endDate)) {
        throw new Error('Invalid planner: endDate must be in YYYY-MM-DD format');
    }

    // Validate staff array
    if (!Array.isArray(obj.staff)) {
        throw new Error('Invalid planner: staff must be an array');
    }
    const staff = obj.staff.map((s, index) => validateStaffMember(s, index));

    // Validate holidays array
    if (!Array.isArray(obj.holidays)) {
        throw new Error('Invalid planner: holidays must be an array');
    }
    const holidays = obj.holidays.map((h, index) => validateHoliday(h, index));

    // Validate assignments object
    if (typeof obj.assignments !== 'object' || obj.assignments === null || Array.isArray(obj.assignments)) {
        throw new Error('Invalid planner: assignments must be an object');
    }
    const assignments = validateAssignments(obj.assignments as Record<string, unknown>);

    return {
        name: obj.name,
        startDate: obj.startDate,
        endDate: obj.endDate,
        staff,
        holidays,
        assignments,
    };
}

function validateStaffMember(data: unknown, index: number): StaffMember {
    if (!data || typeof data !== 'object') {
        throw new Error(`Invalid staff member at index ${index}`);
    }
    const s = data as Record<string, unknown>;

    if (typeof s.id !== 'string') {
        throw new Error(`Invalid staff member at index ${index}: missing id`);
    }
    if (typeof s.name !== 'string') {
        throw new Error(`Invalid staff member at index ${index}: missing name`);
    }
    if (typeof s.color !== 'string') {
        throw new Error(`Invalid staff member at index ${index}: missing color`);
    }
    if (typeof s.position !== 'number') {
        throw new Error(`Invalid staff member at index ${index}: missing position`);
    }

    return {
        id: s.id,
        name: s.name,
        color: s.color,
        position: s.position,
    };
}

function validateHoliday(data: unknown, index: number): Holiday {
    if (!data || typeof data !== 'object') {
        throw new Error(`Invalid holiday at index ${index}`);
    }
    const h = data as Record<string, unknown>;

    if (typeof h.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(h.date)) {
        throw new Error(`Invalid holiday at index ${index}: date must be in YYYY-MM-DD format`);
    }
    if (typeof h.name !== 'string') {
        throw new Error(`Invalid holiday at index ${index}: missing name`);
    }

    return {
        date: h.date,
        name: h.name,
    };
}

function validateAssignments(data: Record<string, unknown>): ShiftAssignments {
    const assignments: ShiftAssignments = {};

    for (const [date, staffIds] of Object.entries(data)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new Error(`Invalid assignment date: ${date}`);
        }
        if (!Array.isArray(staffIds) || !staffIds.every(id => typeof id === 'string')) {
            throw new Error(`Invalid assignment for date ${date}: must be an array of staff IDs`);
        }
        assignments[date] = staffIds as string[];
    }

    return assignments;
}

/**
 * Exports a planner to a JSON file and triggers download.
 */
export function exportPlannerToFile(planner: ShiftPlanner): void {
    // Create a clean export object (without internal fields that might change)
    const exportData = {
        name: planner.name,
        startDate: planner.startDate,
        endDate: planner.endDate,
        staff: planner.staff,
        holidays: planner.holidays,
        assignments: planner.assignments,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create filename from planner name (sanitize for filesystem)
    const safeName = planner.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const filename = `${safeName || 'planificador'}.json`;

    // Create and click download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Parses a JSON string and creates a new planner with a fresh ID.
 * Throws an error if the JSON is invalid or doesn't match the expected structure.
 */
export function importPlannerFromJson(jsonString: string): ShiftPlanner {
    let data: unknown;
    try {
        data = JSON.parse(jsonString);
    } catch {
        throw new Error('Invalid JSON format');
    }

    const validatedData = validatePlannerStructure(data);

    return {
        ...validatedData,
        id: nanoid(),
        creationDate: new Date().toISOString(),
    };
}

/**
 * Reads a File object and returns its content as a string.
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}
