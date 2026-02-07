import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CelestialBackground from './components/CelestialBackground';
import FullScreenLayout from './components/layout/FullScreenLayout';
import Step1_Docking from './components/steps/Step1_Docking';
import Step2_OrbitDance from './components/steps/Step2_OrbitDance';
import Step3_EventHorizon from './components/steps/Step3_EventHorizon';
import Step4_AlignmentPulse from './components/steps/Step4_AlignmentPulse';
import { translations } from './translations';
import type { Language, Translations } from './translations';

import { STEPS } from './constants';
import { useMissionState } from './hooks/useMissionState';

const App: React.FC = () => {
  const { currentStep, isFinished, lang, nextStep, finishMission, toggleLang, resetMission } = useMissionState();

  const t: Translations = translations[lang];

  return (
    <div className="app-root">
      {/* Background stays persistent */}
      <CelestialBackground />

      {/* Language Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleLang}
        className="glass-panel lang-toggle"
      >
        {lang === 'en' ? 'KR' : 'EN'}
      </motion.button>

      <FullScreenLayout>
        {!isFinished && (
          <>
            {currentStep === STEPS.DOCKING + 1 && <Step1_Docking onComplete={nextStep} t={t.step1} title={t.title} slogan={t.slogan} />}
            {currentStep === STEPS.ORBIT_DANCE + 1 && <Step2_OrbitDance onComplete={nextStep} t={t.step2} />}
            {currentStep === STEPS.EVENT_HORIZON + 1 && <Step3_EventHorizon onComplete={nextStep} t={t.step3} />}
            {currentStep === STEPS.ALIGNMENT_PULSE + 1 && <Step4_AlignmentPulse onComplete={finishMission} t={t.step4} />}
          </>
        )}

        {isFinished && (
          <div className="screen-container">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel mission-success-container"
            >
              <h1 className="glow-text-red responsive-hero-title">{t.final.success}</h1>
              <p className="font-orbitron" style={{ marginTop: '1rem' }}>{t.final.message}</p>
              <button
                onClick={resetMission}
                className="glass-panel font-orbitron"
                style={{ padding: '1rem 2rem', marginTop: '3rem', color: 'white', cursor: 'pointer' }}
              >
                {t.final.button}
              </button>
            </motion.div>
          </div>
        )}
      </FullScreenLayout>
    </div>
  );
};

export default App;
