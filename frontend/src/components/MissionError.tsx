import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, XCircle, Settings, Thermometer, Magnet, Zap, Tent } from 'lucide-react';
import type { Translations } from '../translations';

interface MissionErrorProps {
    onRetry: () => void;
    onReset: () => void;
    t: Translations['error'];
}

const MissionError: React.FC<MissionErrorProps> = ({ onRetry, onReset, t }) => {
    return (
        <div className="screen-container flex-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel responsive-padding step-container"
            >
                <div className="flex-center flex-direction-column gap-1rem margin-bottom-2">
                    <XCircle size={64} color="var(--color-error)" className="pulse-red" />
                    <h1 className="font-orbitron text-error text-2rem text-center">{t.title}</h1>
                </div>

                {/* Failure Analysis */}
                <div className="glass-panel p-1-5rem margin-bottom-1-5 bg-black-dim border-error">
                    <div className="flex-center gap-05rem margin-bottom-1 border-bottom-dim pb-05rem">
                        <AlertTriangle size={18} color="var(--color-error)" />
                        <h3 className="font-orbitron text-085rem">{t.analysisTitle}</h3>
                    </div>

                    <ul className="text-left gap-08rem flex flex-direction-column list-none p-0">
                        <li className="flex-center flex-start-gap-08 text-08rem text-white-dim">
                            <Zap size={14} color="var(--color-error)" />
                            {t.causeAzimuth}
                        </li>
                        <li className="flex-center flex-start-gap-08 text-08rem text-white-dim">
                            <Thermometer size={14} color="var(--color-warning)" />
                            {t.causePitch}
                        </li>
                        <li className="flex-center flex-start-gap-08 text-08rem text-white-dim">
                            <Magnet size={14} color="var(--color-warning)" />
                            {t.causeNoise}
                        </li>
                    </ul>
                </div>

                {/* Solution Guide */}
                <div className="text-left margin-bottom-2">
                    <div className="flex-center flex-start-gap-05 margin-bottom-1">
                        <Settings size={18} color="var(--color-info)" />
                        <h4 className="font-orbitron text-085rem text-info">{t.solutionTitle}</h4>
                    </div>

                    <div className="check-row margin-bottom-05rem">
                        <div className="flex-center gap-08rem">
                            <RefreshCw size={16} />
                            <span className="text-075rem">{t.solutionLevel}</span>
                        </div>
                    </div>
                    <div className="check-row margin-bottom-05rem">
                        <div className="flex-center gap-08rem">
                            <Magnet size={16} />
                            <span className="text-075rem">{t.solutionMetal}</span>
                        </div>
                    </div>
                    <div className="check-row margin-bottom-05rem">
                        <div className="flex-center gap-08rem">
                            <Zap size={16} />
                            <span className="text-075rem">{t.solutionSlow}</span>
                        </div>
                    </div>
                    <div className="check-row">
                        <div className="flex-center gap-08rem">
                            <Tent size={16} />
                            <span className="text-075rem">{t.solutionOutdoor}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-center gap-1rem full-width">
                    <button
                        onClick={onRetry}
                        className="btn-step1 bg-error font-orbitron flex-center gap-08rem flex-1"
                    >
                        <RefreshCw size={18} />
                        {t.retry}
                    </button>
                    <button
                        onClick={onReset}
                        className="btn-step1 glass-panel font-orbitron flex-center gap-08rem flex-1"
                    >
                        <AlertTriangle size={18} />
                        {t.reset}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MissionError;
