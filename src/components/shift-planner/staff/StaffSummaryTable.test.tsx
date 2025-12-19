/**
 * Tests for StaffSummaryTable Component
 *
 * Tests cover:
 * - Rendering staff members in a table
 * - Color as background on name cell
 * - Shift count columns (diario, vi, sa, do, total)
 * - Add button functionality
 * - Sorting by position property
 * - Click-to-edit functionality
 * - Drag and drop reordering
 * - Visual feedback during drag operations
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StaffSummaryTable from './StaffSummaryTable';
import { StaffMember, ShiftAssignments, Holiday } from '@/types';

const createMockStaff = (overrides: Partial<StaffMember>[] = []): StaffMember[] => {
    const defaults: StaffMember[] = [
        { id: '1', name: 'Alice', color: '#ff0000', position: 0 },
        { id: '2', name: 'Bob', color: '#00ff00', position: 1 },
        { id: '3', name: 'Charlie', color: '#0000ff', position: 2 },
    ];
    return defaults.map((item, index) => ({
        ...item,
        ...overrides[index],
    }));
};

const emptyAssignments: ShiftAssignments = {};
const emptyHolidays: Holiday[] = [];

// Create assignments for testing shift counts
// 2025-01-06 is Monday, 2025-01-10 is Friday, 2025-01-11 is Saturday, 2025-01-12 is Sunday
const createMockAssignments = (): ShiftAssignments => ({
    '2025-01-06': ['1'],           // Monday - Alice
    '2025-01-07': ['1', '2'],      // Tuesday - Alice, Bob
    '2025-01-08': ['2'],           // Wednesday - Bob
    '2025-01-09': ['1'],           // Thursday - Alice
    '2025-01-10': ['1', '3'],      // Friday - Alice, Charlie
    '2025-01-11': ['2', '3'],      // Saturday - Bob, Charlie
    '2025-01-12': ['3'],           // Sunday - Charlie
});

describe('StaffSummaryTable', () => {
    const mockOnEditStaff = vi.fn();
    const mockOnUpdateStaff = vi.fn();
    const mockOnAddStaff = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders table headers correctly', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Nombre')).toBeInTheDocument();
            expect(screen.getByText('L-J')).toBeInTheDocument();
            expect(screen.getByText('Vi')).toBeInTheDocument();
            expect(screen.getByText('Sa')).toBeInTheDocument();
            expect(screen.getByText('Do')).toBeInTheDocument();
            expect(screen.getByText('Tot')).toBeInTheDocument();
        });

        it('renders all staff members', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Charlie')).toBeInTheDocument();
        });

        it('renders name cell with staff color as background', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const aliceCell = screen.getByText('Alice');
            expect(aliceCell).toHaveStyle({ backgroundColor: '#ff0000' });
        });

        it('renders section title and description', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Personal')).toBeInTheDocument();
            expect(
                screen.getByText('Haz clic en un miembro para editarlo o arrástralo para reordenarlo.')
            ).toBeInTheDocument();
        });

        it('renders add button in header', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const addButton = screen.getByRole('button', { name: 'Añadir persona' });
            expect(addButton).toBeInTheDocument();
            expect(addButton).toHaveTextContent('+');
        });

        it('renders drag handles for each row', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            expect(dragHandles).toHaveLength(3);
        });

        it('renders empty table when no staff provided', () => {
            render(
                <StaffSummaryTable
                    staff={[]}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Personal')).toBeInTheDocument();
            const rows = screen.queryAllByRole('row');
            // Only header row should exist
            expect(rows).toHaveLength(1);
        });
    });

    describe('Shift Counts', () => {
        it('calculates daily count (Mon-Thu) correctly', () => {
            const staff = createMockStaff();
            const assignments = createMockAssignments();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            // Alice has Mon, Tue, Thu = 3 daily shifts
            // Bob has Tue, Wed = 2 daily shifts
            // Charlie has 0 daily shifts
            const rows = screen.getAllByRole('row');
            // Row 1 is header, rows 2-4 are data
            // Each row has 7 cells: drag, name, diario, vi, sa, do, total
            const aliceRow = rows[1];
            const bobRow = rows[2];
            const charlieRow = rows[3];

            expect(aliceRow.querySelectorAll('td')[2]).toHaveTextContent('3');
            expect(bobRow.querySelectorAll('td')[2]).toHaveTextContent('2');
            expect(charlieRow.querySelectorAll('td')[2]).toHaveTextContent('0');
        });

        it('calculates friday count correctly', () => {
            const staff = createMockStaff();
            const assignments = createMockAssignments();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            // Alice has 1 Friday, Bob has 0, Charlie has 1
            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];
            const bobRow = rows[2];
            const charlieRow = rows[3];

            expect(aliceRow.querySelectorAll('td')[3]).toHaveTextContent('1');
            expect(bobRow.querySelectorAll('td')[3]).toHaveTextContent('0');
            expect(charlieRow.querySelectorAll('td')[3]).toHaveTextContent('1');
        });

        it('calculates saturday count correctly', () => {
            const staff = createMockStaff();
            const assignments = createMockAssignments();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            // Alice has 0 Saturday, Bob has 1, Charlie has 1
            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];
            const bobRow = rows[2];
            const charlieRow = rows[3];

            expect(aliceRow.querySelectorAll('td')[4]).toHaveTextContent('0');
            expect(bobRow.querySelectorAll('td')[4]).toHaveTextContent('1');
            expect(charlieRow.querySelectorAll('td')[4]).toHaveTextContent('1');
        });

        it('calculates sunday count correctly', () => {
            const staff = createMockStaff();
            const assignments = createMockAssignments();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            // Alice has 0 Sunday, Bob has 0, Charlie has 1
            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];
            const bobRow = rows[2];
            const charlieRow = rows[3];

            expect(aliceRow.querySelectorAll('td')[5]).toHaveTextContent('0');
            expect(bobRow.querySelectorAll('td')[5]).toHaveTextContent('0');
            expect(charlieRow.querySelectorAll('td')[5]).toHaveTextContent('1');
        });

        it('calculates total count correctly', () => {
            const staff = createMockStaff();
            const assignments = createMockAssignments();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            // Alice: 3 daily + 1 fri = 4 total
            // Bob: 2 daily + 1 sat = 3 total
            // Charlie: 1 fri + 1 sat + 1 sun = 3 total
            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];
            const bobRow = rows[2];
            const charlieRow = rows[3];

            expect(aliceRow.querySelectorAll('td')[6]).toHaveTextContent('4');
            expect(bobRow.querySelectorAll('td')[6]).toHaveTextContent('3');
            expect(charlieRow.querySelectorAll('td')[6]).toHaveTextContent('3');
        });

        it('shows zero counts when no assignments', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];

            // All counts should be 0
            expect(aliceRow.querySelectorAll('td')[2]).toHaveTextContent('0');
            expect(aliceRow.querySelectorAll('td')[3]).toHaveTextContent('0');
            expect(aliceRow.querySelectorAll('td')[4]).toHaveTextContent('0');
            expect(aliceRow.querySelectorAll('td')[5]).toHaveTextContent('0');
            expect(aliceRow.querySelectorAll('td')[6]).toHaveTextContent('0');
        });

        it('counts holidays as sundays regardless of actual day', () => {
            const staff = createMockStaff();
            // 2025-01-06 is Monday, but we mark it as a holiday
            const assignments: ShiftAssignments = {
                '2025-01-06': ['1'],  // Monday (holiday) - Alice
                '2025-01-07': ['1'],  // Tuesday - Alice
            };
            const holidays: Holiday[] = [
                { date: '2025-01-06', name: 'Test Holiday' },
            ];

            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={assignments}
                    holidays={holidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const rows = screen.getAllByRole('row');
            const aliceRow = rows[1];

            // Alice: 1 daily (Tuesday) + 1 sunday (Monday holiday) = 2 total
            expect(aliceRow.querySelectorAll('td')[2]).toHaveTextContent('1'); // L-J (only Tuesday)
            expect(aliceRow.querySelectorAll('td')[5]).toHaveTextContent('1'); // Do (Monday as holiday)
            expect(aliceRow.querySelectorAll('td')[6]).toHaveTextContent('2'); // Total
        });
    });

    describe('Add Staff', () => {
        it('calls onAddStaff when add button is clicked', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const addButton = screen.getByRole('button', { name: 'Añadir persona' });
            fireEvent.click(addButton);

            expect(mockOnAddStaff).toHaveBeenCalledTimes(1);
        });
    });

    describe('Sorting by Position', () => {
        it('sorts staff members by position in ascending order', () => {
            const unsortedStaff: StaffMember[] = [
                { id: '3', name: 'Charlie', color: '#0000ff', position: 2 },
                { id: '1', name: 'Alice', color: '#ff0000', position: 0 },
                { id: '2', name: 'Bob', color: '#00ff00', position: 1 },
            ];

            render(
                <StaffSummaryTable
                    staff={unsortedStaff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const rows = screen.getAllByRole('row');
            // Row 0 is header, rows 1-3 are data
            expect(rows[1].querySelectorAll('td')[1]).toHaveTextContent('Alice');
            expect(rows[2].querySelectorAll('td')[1]).toHaveTextContent('Bob');
            expect(rows[3].querySelectorAll('td')[1]).toHaveTextContent('Charlie');
        });

        it('maintains sort order when staff prop changes', () => {
            const staff = createMockStaff();
            const { rerender } = render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const updatedStaff: StaffMember[] = [
                { id: '2', name: 'Bob', color: '#00ff00', position: 0 },
                { id: '1', name: 'Alice', color: '#ff0000', position: 1 },
                { id: '3', name: 'Charlie', color: '#0000ff', position: 2 },
            ];

            rerender(
                <StaffSummaryTable
                    staff={updatedStaff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const rows = screen.getAllByRole('row');
            expect(rows[1].querySelectorAll('td')[1]).toHaveTextContent('Bob');
            expect(rows[2].querySelectorAll('td')[1]).toHaveTextContent('Alice');
            expect(rows[3].querySelectorAll('td')[1]).toHaveTextContent('Charlie');
        });
    });

    describe('Click to Edit', () => {
        it('calls onEditStaff when clicking on a row', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            fireEvent.click(screen.getByText('Alice'));

            expect(mockOnEditStaff).toHaveBeenCalledTimes(1);
            expect(mockOnEditStaff).toHaveBeenCalledWith(staff[0]);
        });

        it('calls onEditStaff with correct staff member for each row', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            fireEvent.click(screen.getByText('Bob'));
            expect(mockOnEditStaff).toHaveBeenLastCalledWith(staff[1]);

            fireEvent.click(screen.getByText('Charlie'));
            expect(mockOnEditStaff).toHaveBeenLastCalledWith(staff[2]);
        });
    });

    describe('Drag and Drop', () => {
        it('sets opacity when dragging starts', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const firstRow = screen.getByText('Alice').closest('tr');

            fireEvent.dragStart(dragHandles[0]);

            expect(firstRow).toHaveClass('opacity-50');
        });

        it('removes opacity when drag ends', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const firstRow = screen.getByText('Alice').closest('tr');

            fireEvent.dragStart(dragHandles[0]);
            expect(firstRow).toHaveClass('opacity-50');

            fireEvent.dragEnd(dragHandles[0]);
            expect(firstRow).not.toHaveClass('opacity-50');
        });

        it('calls onUpdateStaff with reordered list after drop', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const secondRow = screen.getByText('Bob').closest('tr');

            // Start dragging the first item (Alice)
            fireEvent.dragStart(dragHandles[0]);

            // Drop on the second row (Bob's position)
            fireEvent.dragOver(secondRow!);
            fireEvent.drop(secondRow!);

            expect(mockOnUpdateStaff).toHaveBeenCalledTimes(1);
            const updatedStaff = mockOnUpdateStaff.mock.calls[0][0];

            // After moving Alice to Bob's position:
            // Bob should be first, Alice second, Charlie third
            expect(updatedStaff[0].name).toBe('Bob');
            expect(updatedStaff[0].position).toBe(0);
            expect(updatedStaff[1].name).toBe('Alice');
            expect(updatedStaff[1].position).toBe(1);
            expect(updatedStaff[2].name).toBe('Charlie');
            expect(updatedStaff[2].position).toBe(2);
        });

        it('does not call onUpdateStaff when dropping on same position', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const firstRow = screen.getByText('Alice').closest('tr');

            // Start dragging the first item
            fireEvent.dragStart(dragHandles[0]);

            // Drop on the same row
            fireEvent.dragOver(firstRow!);
            fireEvent.drop(firstRow!);

            expect(mockOnUpdateStaff).not.toHaveBeenCalled();
        });

        it('moves item to end of list correctly', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const thirdRow = screen.getByText('Charlie').closest('tr');

            // Drag first item (Alice) to last position (Charlie)
            fireEvent.dragStart(dragHandles[0]);
            fireEvent.dragOver(thirdRow!);
            fireEvent.drop(thirdRow!);

            expect(mockOnUpdateStaff).toHaveBeenCalledTimes(1);
            const updatedStaff = mockOnUpdateStaff.mock.calls[0][0];

            // Order should be: Bob, Charlie, Alice
            expect(updatedStaff[0].name).toBe('Bob');
            expect(updatedStaff[1].name).toBe('Charlie');
            expect(updatedStaff[2].name).toBe('Alice');
        });

        it('moves item from end to beginning correctly', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            const firstRow = screen.getByText('Alice').closest('tr');

            // Drag last item (Charlie) to first position (Alice)
            fireEvent.dragStart(dragHandles[2]);
            fireEvent.dragOver(firstRow!);
            fireEvent.drop(firstRow!);

            expect(mockOnUpdateStaff).toHaveBeenCalledTimes(1);
            const updatedStaff = mockOnUpdateStaff.mock.calls[0][0];

            // Order should be: Charlie, Alice, Bob
            expect(updatedStaff[0].name).toBe('Charlie');
            expect(updatedStaff[1].name).toBe('Alice');
            expect(updatedStaff[2].name).toBe('Bob');
        });
    });

    describe('Accessibility', () => {
        it('has proper table structure', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getAllByRole('columnheader')).toHaveLength(7); // drag, name, diario, vi, sa, do, total
            expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
        });

        it('drag handles have accessible title', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            expect(dragHandles).toHaveLength(3);
        });

        it('column headers have tooltips for abbreviations', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    assignments={emptyAssignments}
                    holidays={emptyHolidays}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByTitle('Lunes a Jueves')).toBeInTheDocument();
            expect(screen.getByTitle('Viernes')).toBeInTheDocument();
            expect(screen.getByTitle('Sábado')).toBeInTheDocument();
            expect(screen.getByTitle('Domingo')).toBeInTheDocument();
        });
    });
});
