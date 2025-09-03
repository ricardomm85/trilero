'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { DateRange } from 'react-day-picker';
import { ShiftPlanner, StaffMember, Holiday } from '@/types';

import Step1Info from '@/components/shift-planner/new/Step1Info';
import Step2Staff from '@/components/shift-planner/new/Step2Staff';
import Step3Holidays from '@/components/shift-planner/new/Step3Holidays';
import WizardNavigation from '@/components/shift-planner/new/WizardNavigation';
import { formatDateToYYYYMMDD } from '@/utils/dates';

const SHIFT_PLANNERS_STORAGE_KEY = 'shiftPlanners';
const TOTAL_STEPS = 3;

export default function NewShiftPlannerWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Wizard data state
  const [name, setName] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    // Finalize data and save to localStorage
    const newPlanner: ShiftPlanner = {
      id: nanoid(6),
      name,
      creationDate: new Date().toISOString(),
      startDate: formatDateToYYYYMMDD(dateRange.from),
      endDate: formatDateToYYYYMMDD(dateRange.to),
      staff: staff.map(s => ({ ...s, id: nanoid(6) })), // Assign final nanoids
      holidays,
      assignments: {}, // Start with empty assignments
    };

    const existingPlanners: ShiftPlanner[] = JSON.parse(localStorage.getItem(SHIFT_PLANNERS_STORAGE_KEY) || '[]');
    localStorage.setItem(SHIFT_PLANNERS_STORAGE_KEY, JSON.stringify([...existingPlanners, newPlanner]));

    router.push('/shift-planner/list');
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !name || !dateRange?.from || !dateRange?.to;
      case 2:
        return staff.length === 0;
      case 3:
        return false; // No validation needed for holidays
      default:
        return true;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">Crear Nueva Planilla</h1>
          <p className="text-center text-gray-500 mt-2">Paso {currentStep} de {TOTAL_STEPS}</p>
        </div>

        {currentStep === 1 && (
          <Step1Info name={name} onNameChange={setName} dateRange={dateRange} onDateRangeChange={setDateRange} />
        )}
        {currentStep === 2 && (
          <Step2Staff staff={staff} onStaffChange={setStaff} />
        )}
        {currentStep === 3 && (
          <Step3Holidays dateRange={dateRange} holidays={holidays} onHolidaysChange={setHolidays} />
        )}

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onNext={handleNext}
          onBack={handleBack}
          isNextDisabled={isNextDisabled()}
        />
      </div>
    </div>
  );
}
