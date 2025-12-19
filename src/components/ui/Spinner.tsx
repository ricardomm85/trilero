/**
 * Spinner Component
 *
 * A reusable loading spinner with consistent styling across the app.
 * Uses purple color scheme to match the application design.
 *
 * @prop {string} size - Size variant: 'sm' (24px), 'md' (48px), 'lg' (64px). Default: 'md'
 * @prop {string} className - Additional CSS classes
 *
 * @example
 * <Spinner />
 * <Spinner size="sm" />
 * <Spinner size="lg" className="mt-4" />
 */

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
};

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    return (
        <div
            className={`animate-spin rounded-full border-purple-200 border-t-purple-600 ${sizeClasses[size]} ${className}`}
            role="status"
            aria-label="Cargando"
        >
            <span className="sr-only">Cargando...</span>
        </div>
    );
}
