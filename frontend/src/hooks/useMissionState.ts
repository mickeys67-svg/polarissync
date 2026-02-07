import { useState } from 'react';
import type { Language } from '../translations';

export const useMissionState = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isFinished, setIsFinished] = useState(false);
    const [lang, setLang] = useState<Language>('ko');

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const finishMission = () => setIsFinished(true);
    const toggleLang = () => setLang(prev => (prev === 'en' ? 'ko' : 'en'));
    const resetMission = () => {
        setCurrentStep(1);
        setIsFinished(false);
    };

    return {
        currentStep,
        isFinished,
        lang,
        nextStep,
        finishMission,
        toggleLang,
        resetMission
    };
};
