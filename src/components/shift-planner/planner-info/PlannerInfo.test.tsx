/**
 * Tests for PlannerInfo Component
 *
 * Tests cover:
 * - Rendering planner name prominently
 * - Rendering date range in Spanish format
 * - Edit button with pencil icon
 * - Opening edit modal on button click
 * - Accessibility attributes
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlannerInfo from './PlannerInfo';
import { ShiftPlanner } from '@/types';

// Mock EditInfoModal to avoid testing its internals
vi.mock('./EditInfoModal', () => ({
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
        isOpen ? (
            <div data-testid="edit-modal">
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));

const createMockPlanner = (overrides: Partial<ShiftPlanner> = {}): ShiftPlanner => ({
    id: 'planner-1',
    name: 'Mi Planificador',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    creationDate: '2025-01-01T00:00:00.000Z',
    staff: [],
    holidays: [],
    assignments: {},
    ...overrides,
});

describe('PlannerInfo', () => {
    const mockOnUpdate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders the planner name as main heading', () => {
            const planner = createMockPlanner({ name: 'Test Planner' });
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent('Test Planner');
        });

        it('renders date range in Spanish format', () => {
            const planner = createMockPlanner({
                startDate: '2025-12-01',
                endDate: '2026-03-31',
            });
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            // Should show "dic 2025 - mar 2026"
            expect(screen.getByText(/dic 2025/i)).toBeInTheDocument();
            expect(screen.getByText(/mar 2026/i)).toBeInTheDocument();
        });

        it('shows tooltip with full name for long names', () => {
            const planner = createMockPlanner({ name: 'Very Long Planner Name That Might Truncate' });
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveAttribute('title', 'Very Long Planner Name That Might Truncate');
        });

        it('renders edit button with pencil icon', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const editButton = screen.getByRole('button', { name: /editar información/i });
            expect(editButton).toBeInTheDocument();

            // Check for SVG icon inside button
            const svg = editButton.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
    });

    describe('Edit Modal', () => {
        it('opens modal when edit button is clicked', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            // Modal should not be visible initially
            expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();

            // Click edit button
            const editButton = screen.getByRole('button', { name: /editar información/i });
            fireEvent.click(editButton);

            // Modal should now be visible
            expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
        });

        it('closes modal when close is triggered', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            // Open modal
            fireEvent.click(screen.getByRole('button', { name: /editar información/i }));
            expect(screen.getByTestId('edit-modal')).toBeInTheDocument();

            // Close modal
            fireEvent.click(screen.getByText('Close'));
            expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('edit button has accessible label', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const editButton = screen.getByRole('button', { name: /editar información del planificador/i });
            expect(editButton).toBeInTheDocument();
        });

        it('edit button has title for tooltip', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const editButton = screen.getByRole('button', { name: /editar información/i });
            expect(editButton).toHaveAttribute('title', 'Editar información');
        });

        it('pencil icon is hidden from screen readers', () => {
            const planner = createMockPlanner();
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            const editButton = screen.getByRole('button', { name: /editar información/i });
            const svg = editButton.querySelector('svg');
            expect(svg).toHaveAttribute('aria-hidden', 'true');
        });
    });

    describe('Date Formatting', () => {
        it('handles same month start and end', () => {
            const planner = createMockPlanner({
                startDate: '2025-01-01',
                endDate: '2025-01-31',
            });
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            // Both should show "ene 2025"
            const dateText = screen.getByText(/ene 2025 - ene 2025/i);
            expect(dateText).toBeInTheDocument();
        });

        it('handles different years', () => {
            const planner = createMockPlanner({
                startDate: '2024-11-01',
                endDate: '2025-02-28',
            });
            render(<PlannerInfo planner={planner} onUpdate={mockOnUpdate} />);

            expect(screen.getByText(/nov 2024/i)).toBeInTheDocument();
            expect(screen.getByText(/feb 2025/i)).toBeInTheDocument();
        });
    });
});
