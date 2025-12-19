/**
 * Tests for EditStaffModal Component
 *
 * Tests cover:
 * - Modal visibility based on isOpen and staffMember props
 * - Editing staff member name and color
 * - Save functionality
 * - Delete functionality with confirmation
 * - Cancel button behavior
 * - State reset when staffMember changes (via key prop)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditStaffModal from './EditStaffModal';
import { StaffMember } from '@/types';

// Mock Portal to render children directly
vi.mock('@/components/Portal', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="portal">{children}</div>,
}));

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
    writable: true,
    value: mockConfirm,
});

const createMockStaffMember = (overrides: Partial<StaffMember> = {}): StaffMember => ({
    id: '1',
    name: 'Alice',
    color: '#ff0000',
    position: 0,
    ...overrides,
});

describe('EditStaffModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockConfirm.mockReturnValue(false);
    });

    describe('Visibility', () => {
        it('renders nothing when isOpen is false', () => {
            const staffMember = createMockStaffMember();
            const { container } = render(
                <EditStaffModal
                    isOpen={false}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            expect(container).toBeEmptyDOMElement();
        });

        it('renders nothing when staffMember is null', () => {
            const { container } = render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={null}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            expect(container).toBeEmptyDOMElement();
        });

        it('renders modal when isOpen is true and staffMember exists', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Editar Persona')).toBeInTheDocument();
        });
    });

    describe('Rendering', () => {
        it('displays staff member name in input', () => {
            const staffMember = createMockStaffMember({ name: 'Bob' });
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            const nameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
            expect(nameInput.value).toBe('Bob');
        });

        it('displays all action buttons', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Eliminar')).toBeInTheDocument();
            expect(screen.getByText('Cancelar')).toBeInTheDocument();
            expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
        });
    });

    describe('Edit Name', () => {
        it('updates name input when typing', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            const nameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
            fireEvent.change(nameInput, { target: { value: 'New Name' } });

            expect(nameInput.value).toBe('New Name');
        });
    });

    describe('Save', () => {
        it('calls onSave with updated staff member when clicking save', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            const nameInput = screen.getByLabelText('Nombre');
            fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

            fireEvent.click(screen.getByText('Guardar Cambios'));

            expect(mockOnSave).toHaveBeenCalledTimes(1);
            expect(mockOnSave).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: '1',
                    name: 'Updated Name',
                    position: 0,
                })
            );
        });

        it('calls onClose after saving', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Guardar Cambios'));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Cancel', () => {
        it('calls onClose when clicking cancel', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Cancelar'));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onSave or onDelete when canceling', () => {
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Cancelar'));

            expect(mockOnSave).not.toHaveBeenCalled();
            expect(mockOnDelete).not.toHaveBeenCalled();
        });
    });

    describe('Delete', () => {
        it('shows confirmation dialog when clicking delete', () => {
            const staffMember = createMockStaffMember({ name: 'Alice' });
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Eliminar'));

            expect(mockConfirm).toHaveBeenCalledTimes(1);
            expect(mockConfirm).toHaveBeenCalledWith(
                '¿Estás seguro de que quieres eliminar a "Alice"?'
            );
        });

        it('calls onDelete when confirmation is accepted', () => {
            mockConfirm.mockReturnValue(true);
            const staffMember = createMockStaffMember({ id: 'staff-123' });
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Eliminar'));

            expect(mockOnDelete).toHaveBeenCalledTimes(1);
            expect(mockOnDelete).toHaveBeenCalledWith('staff-123');
        });

        it('calls onClose after deleting', () => {
            mockConfirm.mockReturnValue(true);
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Eliminar'));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onDelete when confirmation is rejected', () => {
            mockConfirm.mockReturnValue(false);
            const staffMember = createMockStaffMember();
            render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            fireEvent.click(screen.getByText('Eliminar'));

            expect(mockOnDelete).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    describe('State Reset', () => {
        it('resets state when staffMember changes (via key prop)', () => {
            const staffMember1 = createMockStaffMember({ id: '1', name: 'Alice' });
            const staffMember2 = createMockStaffMember({ id: '2', name: 'Bob' });

            const { rerender } = render(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember1}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            // Modify the input
            const nameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
            fireEvent.change(nameInput, { target: { value: 'Modified Name' } });
            expect(nameInput.value).toBe('Modified Name');

            // Change to different staff member
            rerender(
                <EditStaffModal
                    isOpen={true}
                    onClose={mockOnClose}
                    staffMember={staffMember2}
                    onSave={mockOnSave}
                    onDelete={mockOnDelete}
                />
            );

            // Should show new staff member's name
            const updatedNameInput = screen.getByLabelText('Nombre') as HTMLInputElement;
            expect(updatedNameInput.value).toBe('Bob');
        });
    });
});
