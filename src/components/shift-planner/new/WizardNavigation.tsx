'use client';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
}

export default function WizardNavigation({ currentStep, totalSteps, onNext, onBack, isNextDisabled }: WizardNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 ? (
        <button
          onClick={onBack}
          className="rounded-full bg-gray-300 px-6 py-3 text-gray-700 shadow-md transition-transform hover:scale-105"
        >
          Atrás
        </button>
      ) : (
        <div></div> // Placeholder to keep the "Next" button on the right
      )}
      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      ) : (
        <button
          onClick={onNext} // This will be the "Finish" action
          disabled={isNextDisabled}
          className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar
        </button>
      )}
    </div>
  );
}
