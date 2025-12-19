/**
 * Tests for Planner Utility Functions
 *
 * Tests cover:
 * - validatePlannerStructure validation logic
 * - importPlannerFromJson parsing and validation
 * - exportPlannerToFile file creation
 * - readFileAsText file reading
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    validatePlannerStructure,
    importPlannerFromJson,
    exportPlannerToFile,
    readFileAsText,
} from './planner';
import { ShiftPlanner } from '@/types';

describe('validatePlannerStructure', () => {
    const validPlannerData = {
        name: 'Test Planner',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        staff: [
            { id: 'staff-1', name: 'Person 1', color: '#FF0000', position: 0 },
        ],
        holidays: [
            { date: '2025-01-06', name: 'Epifanía' },
        ],
        assignments: {
            '2025-01-15': ['staff-1'],
        },
    };

    describe('Valid Data', () => {
        it('accepts valid planner data', () => {
            const result = validatePlannerStructure(validPlannerData);
            expect(result.name).toBe('Test Planner');
            expect(result.startDate).toBe('2025-01-01');
            expect(result.endDate).toBe('2025-03-31');
            expect(result.staff).toHaveLength(1);
            expect(result.holidays).toHaveLength(1);
            expect(result.assignments['2025-01-15']).toEqual(['staff-1']);
        });

        it('accepts empty staff array', () => {
            const data = { ...validPlannerData, staff: [] };
            const result = validatePlannerStructure(data);
            expect(result.staff).toEqual([]);
        });

        it('accepts empty holidays array', () => {
            const data = { ...validPlannerData, holidays: [] };
            const result = validatePlannerStructure(data);
            expect(result.holidays).toEqual([]);
        });

        it('accepts empty assignments object', () => {
            const data = { ...validPlannerData, assignments: {} };
            const result = validatePlannerStructure(data);
            expect(result.assignments).toEqual({});
        });
    });

    describe('Invalid Root Object', () => {
        it('throws for null', () => {
            expect(() => validatePlannerStructure(null)).toThrow('Invalid data: expected an object');
        });

        it('throws for undefined', () => {
            expect(() => validatePlannerStructure(undefined)).toThrow('Invalid data: expected an object');
        });

        it('throws for string', () => {
            expect(() => validatePlannerStructure('not an object')).toThrow('Invalid data: expected an object');
        });

        it('throws for array', () => {
            expect(() => validatePlannerStructure([])).toThrow('Invalid planner: missing or empty name');
        });
    });

    describe('Invalid Name', () => {
        it('throws for missing name', () => {
            const { name: _, ...data } = validPlannerData;
            expect(() => validatePlannerStructure(data)).toThrow('missing or empty name');
        });

        it('throws for empty name', () => {
            const data = { ...validPlannerData, name: '' };
            expect(() => validatePlannerStructure(data)).toThrow('missing or empty name');
        });

        it('throws for whitespace-only name', () => {
            const data = { ...validPlannerData, name: '   ' };
            expect(() => validatePlannerStructure(data)).toThrow('missing or empty name');
        });

        it('throws for non-string name', () => {
            const data = { ...validPlannerData, name: 123 };
            expect(() => validatePlannerStructure(data)).toThrow('missing or empty name');
        });
    });

    describe('Invalid Dates', () => {
        it('throws for missing startDate', () => {
            const { startDate: _, ...data } = validPlannerData;
            expect(() => validatePlannerStructure(data)).toThrow('startDate must be in YYYY-MM-DD format');
        });

        it('throws for invalid startDate format', () => {
            const data = { ...validPlannerData, startDate: '01-01-2025' };
            expect(() => validatePlannerStructure(data)).toThrow('startDate must be in YYYY-MM-DD format');
        });

        it('throws for missing endDate', () => {
            const { endDate: _, ...data } = validPlannerData;
            expect(() => validatePlannerStructure(data)).toThrow('endDate must be in YYYY-MM-DD format');
        });

        it('throws for invalid endDate format', () => {
            const data = { ...validPlannerData, endDate: '2025/03/31' };
            expect(() => validatePlannerStructure(data)).toThrow('endDate must be in YYYY-MM-DD format');
        });
    });

    describe('Invalid Staff', () => {
        it('throws for non-array staff', () => {
            const data = { ...validPlannerData, staff: 'not an array' };
            expect(() => validatePlannerStructure(data)).toThrow('staff must be an array');
        });

        it('throws for staff member without id', () => {
            const data = {
                ...validPlannerData,
                staff: [{ name: 'Person', color: '#FF0000', position: 0 }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('staff member at index 0: missing id');
        });

        it('throws for staff member without name', () => {
            const data = {
                ...validPlannerData,
                staff: [{ id: 'staff-1', color: '#FF0000', position: 0 }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('staff member at index 0: missing name');
        });

        it('throws for staff member without color', () => {
            const data = {
                ...validPlannerData,
                staff: [{ id: 'staff-1', name: 'Person', position: 0 }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('staff member at index 0: missing color');
        });

        it('throws for staff member without position', () => {
            const data = {
                ...validPlannerData,
                staff: [{ id: 'staff-1', name: 'Person', color: '#FF0000' }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('staff member at index 0: missing position');
        });
    });

    describe('Invalid Holidays', () => {
        it('throws for non-array holidays', () => {
            const data = { ...validPlannerData, holidays: {} };
            expect(() => validatePlannerStructure(data)).toThrow('holidays must be an array');
        });

        it('throws for holiday without valid date', () => {
            const data = {
                ...validPlannerData,
                holidays: [{ date: 'invalid', name: 'Holiday' }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('holiday at index 0: date must be in YYYY-MM-DD format');
        });

        it('throws for holiday without name', () => {
            const data = {
                ...validPlannerData,
                holidays: [{ date: '2025-01-06' }],
            };
            expect(() => validatePlannerStructure(data)).toThrow('holiday at index 0: missing name');
        });
    });

    describe('Invalid Assignments', () => {
        it('throws for non-object assignments', () => {
            const data = { ...validPlannerData, assignments: [] };
            expect(() => validatePlannerStructure(data)).toThrow('assignments must be an object');
        });

        it('throws for null assignments', () => {
            const data = { ...validPlannerData, assignments: null };
            expect(() => validatePlannerStructure(data)).toThrow('assignments must be an object');
        });

        it('throws for invalid date key in assignments', () => {
            const data = {
                ...validPlannerData,
                assignments: { 'invalid-date': ['staff-1'] },
            };
            expect(() => validatePlannerStructure(data)).toThrow('Invalid assignment date: invalid-date');
        });

        it('throws for non-array value in assignments', () => {
            const data = {
                ...validPlannerData,
                assignments: { '2025-01-15': 'staff-1' },
            };
            expect(() => validatePlannerStructure(data)).toThrow('must be an array of staff IDs');
        });

        it('throws for non-string IDs in assignments', () => {
            const data = {
                ...validPlannerData,
                assignments: { '2025-01-15': [123] },
            };
            expect(() => validatePlannerStructure(data)).toThrow('must be an array of staff IDs');
        });
    });
});

describe('importPlannerFromJson', () => {
    const validJson = JSON.stringify({
        name: 'Imported Planner',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        staff: [],
        holidays: [],
        assignments: {},
    });

    it('parses valid JSON and creates planner with new ID', () => {
        const result = importPlannerFromJson(validJson);
        expect(result.name).toBe('Imported Planner');
        expect(result.id).toBeDefined();
        expect(result.id.length).toBeGreaterThan(0);
        expect(result.creationDate).toBeDefined();
    });

    it('generates unique IDs for each import', () => {
        const result1 = importPlannerFromJson(validJson);
        const result2 = importPlannerFromJson(validJson);
        expect(result1.id).not.toBe(result2.id);
    });

    it('throws for invalid JSON syntax', () => {
        expect(() => importPlannerFromJson('{ invalid json')).toThrow('Invalid JSON format');
    });

    it('throws for invalid planner structure', () => {
        const invalidJson = JSON.stringify({ name: '' });
        expect(() => importPlannerFromJson(invalidJson)).toThrow();
    });
});

describe('exportPlannerToFile', () => {
    const mockPlanner: ShiftPlanner = {
        id: 'test-id',
        name: 'Test Planner',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        creationDate: '2025-01-01T00:00:00.000Z',
        staff: [{ id: 'staff-1', name: 'Person 1', color: '#FF0000', position: 0 }],
        holidays: [{ date: '2025-01-06', name: 'Epifanía' }],
        assignments: { '2025-01-15': ['staff-1'] },
    };

    let createObjectURLMock: ReturnType<typeof vi.fn>;
    let revokeObjectURLMock: ReturnType<typeof vi.fn>;
    let createElementMock: ReturnType<typeof vi.fn>;
    let appendChildMock: ReturnType<typeof vi.fn>;
    let removeChildMock: ReturnType<typeof vi.fn>;
    let linkClickMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        createObjectURLMock = vi.fn(() => 'blob:test-url');
        revokeObjectURLMock = vi.fn();
        linkClickMock = vi.fn();
        appendChildMock = vi.fn();
        removeChildMock = vi.fn();

        createElementMock = vi.fn(() => ({
            href: '',
            download: '',
            click: linkClickMock,
        }));

        vi.stubGlobal('URL', {
            createObjectURL: createObjectURLMock,
            revokeObjectURL: revokeObjectURLMock,
        });
        document.createElement = createElementMock as unknown as typeof document.createElement;
        document.body.appendChild = appendChildMock as unknown as typeof document.body.appendChild;
        document.body.removeChild = removeChildMock as unknown as typeof document.body.removeChild;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('creates a blob with JSON content', () => {
        exportPlannerToFile(mockPlanner);

        expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
        const blob = createObjectURLMock.mock.calls[0][0] as Blob;
        expect(blob.type).toBe('application/json');
    });

    it('creates a download link with correct filename', () => {
        exportPlannerToFile(mockPlanner);

        expect(createElementMock).toHaveBeenCalledWith('a');
        const link = createElementMock.mock.results[0].value;
        expect(link.download).toBe('test-planner.json');
    });

    it('sanitizes filename for special characters', () => {
        const plannerWithSpecialName: ShiftPlanner = {
            ...mockPlanner,
            name: 'Planner@With$pecial&Chars!',
        };
        exportPlannerToFile(plannerWithSpecialName);

        const link = createElementMock.mock.results[0].value;
        expect(link.download).toBe('planner-with-pecial-chars.json');
    });

    it('uses default filename for empty name after sanitization', () => {
        const plannerWithSymbolsOnly: ShiftPlanner = {
            ...mockPlanner,
            name: '@#$%',
        };
        exportPlannerToFile(plannerWithSymbolsOnly);

        const link = createElementMock.mock.results[0].value;
        expect(link.download).toBe('planificador.json');
    });

    it('clicks the link to trigger download', () => {
        exportPlannerToFile(mockPlanner);
        expect(linkClickMock).toHaveBeenCalled();
    });

    it('cleans up after download', () => {
        exportPlannerToFile(mockPlanner);
        expect(appendChildMock).toHaveBeenCalled();
        expect(removeChildMock).toHaveBeenCalled();
        expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');
    });

    it('does not include id or creationDate in export', () => {
        const stringifySpy = vi.spyOn(JSON, 'stringify');
        exportPlannerToFile(mockPlanner);

        expect(stringifySpy).toHaveBeenCalled();
        const exportedData = stringifySpy.mock.calls[0][0];

        expect(exportedData.id).toBeUndefined();
        expect(exportedData.creationDate).toBeUndefined();
        expect(exportedData.name).toBe('Test Planner');
        expect(exportedData.startDate).toBe('2025-01-01');
        expect(exportedData.endDate).toBe('2025-03-31');
        expect(exportedData.staff).toHaveLength(1);
        expect(exportedData.holidays).toHaveLength(1);

        stringifySpy.mockRestore();
    });
});

describe('readFileAsText', () => {
    it('reads file content as text', async () => {
        const content = '{"test": "content"}';
        const file = new File([content], 'test.json', { type: 'application/json' });

        const result = await readFileAsText(file);
        expect(result).toBe(content);
    });

    it('handles UTF-8 content correctly', async () => {
        const content = '{"name": "Planificador con ñ y acentos: áéíóú"}';
        const file = new File([content], 'test.json', { type: 'application/json' });

        const result = await readFileAsText(file);
        expect(result).toBe(content);
    });
});
