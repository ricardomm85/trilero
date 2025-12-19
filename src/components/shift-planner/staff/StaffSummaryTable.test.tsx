/**
 * Tests for StaffSummaryTable Component
 *
 * Tests cover:
 * - Rendering staff members in a table
 * - Add button functionality
 * - Sorting by position property
 * - Click-to-edit functionality
 * - Drag and drop reordering
 * - Visual feedback during drag operations
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StaffSummaryTable from './StaffSummaryTable';
import { StaffMember } from '@/types';

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
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Nombre')).toBeInTheDocument();
            expect(screen.getByText('Color')).toBeInTheDocument();
        });

        it('renders all staff members', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
            expect(screen.getByText('Charlie')).toBeInTheDocument();
        });

        it('renders color indicators for each staff member', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const colorIndicators = document.querySelectorAll('.rounded-full');
            // 3 staff colors + 1 add button (which is also rounded-full)
            expect(colorIndicators).toHaveLength(4);
        });

        it('renders section title and description', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
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

    describe('Add Staff', () => {
        it('calls onAddStaff when add button is clicked', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
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
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const cells = screen.getAllByRole('cell');
            // Each row has 3 cells: drag handle, name, color
            // Find name cells (index 1, 4, 7)
            const names = [cells[1].textContent, cells[4].textContent, cells[7].textContent];
            expect(names).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('maintains sort order when staff prop changes', () => {
            const staff = createMockStaff();
            const { rerender } = render(
                <StaffSummaryTable
                    staff={staff}
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
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const cells = screen.getAllByRole('cell');
            const names = [cells[1].textContent, cells[4].textContent, cells[7].textContent];
            expect(names).toEqual(['Bob', 'Alice', 'Charlie']);
        });
    });

    describe('Click to Edit', () => {
        it('calls onEditStaff when clicking on a row', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
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
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getAllByRole('columnheader')).toHaveLength(3);
            expect(screen.getAllByRole('row')).toHaveLength(4); // 1 header + 3 data rows
        });

        it('drag handles have accessible title', () => {
            const staff = createMockStaff();
            render(
                <StaffSummaryTable
                    staff={staff}
                    onEditStaff={mockOnEditStaff}
                    onUpdateStaff={mockOnUpdateStaff}
                    onAddStaff={mockOnAddStaff}
                />
            );

            const dragHandles = screen.getAllByTitle('Arrastrar para reordenar');
            expect(dragHandles).toHaveLength(3);
        });
    });
});
