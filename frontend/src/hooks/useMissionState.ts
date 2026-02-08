import { useState, useCallback } from 'react';

export const useMissionState = (totalSteps = 2) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nextStep = useCallback(() => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, totalSteps]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const finishMission = useCallback(() => {
        setIsFinished(true);
    }, []);

    const resetMission = useCallback(() => {
        setCurrentStep(0);
        setIsFinished(false);
        setError(null);
    }, []);

    return {
        currentStep,
        nextStep,
        prevStep,
        isFinished,
        finishMission,
        resetMission,
        error,
        setError
    };
};
