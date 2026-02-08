import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Compass } from 'lucide-react';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import type { Translations } from '../translations';

interface SensorTelemetryProps {
    onComplete: () => void;
    t: Translations['dashboard'];
}

const SensorTelemetry: React.FC<SensorTelemetryProps> = ({ onComplete, t }) => {
    const { data: orientation, status, startTracking } = useDeviceOrientation();
    const [history, setHistory] = useState<{ alpha: number; beta: number }[]>([]);
    const [stabilityScore, setStabilityScore] = useState(0);
    const [canOverride, setCanOverride] = useState(false);
    const maxPoints = 50;

    useEffect(() => {
        if (status === 'idle') startTracking();

        // Failsafe: Enable proceed button after 5 seconds regardless of stability
        const timer = setTimeout(() => {
            setCanOverride(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [status, startTracking]);

    useEffect(() => {
        setHistory(prev => {
            const newHistory = [...prev, { alpha: orientation.alpha, beta: orientation.beta }];
            if (newHistory.length > maxPoints) return newHistory.slice(1);
            return newHistory;
        });

        // Calculate stability (inverse of delta variance)
        if (history.length > 2) {
            const last = history[history.length - 1];
            const prev = history[history.length - 2];
            const diff = Math.abs(last.alpha - prev.alpha) + Math.abs(last.beta - prev.beta);
            const score = Math.max(0, 100 - diff * 20);
            setStabilityScore(prevScore => (prevScore * 0.8) + (score * 0.2)); // Smoothing
        }
    }, [orientation.alpha, orientation.beta]);

    const isWithinRange = Math.abs(orientation.beta) <= 5;
    const isStable = stabilityScore > 85;

    // SVG Graph Path Helpers
    const generatePath = (data: number[], scale: number, offset: number) => {
        if (data.length < 2) return "";
        return data.map((val, i) => {
            const x = (i / (maxPoints - 1)) * 100;
            const y = 50 - (val - offset) * scale;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(" ");
    };

    return (
        <div className="screen-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel responsive-padding step-container"
            >
                <div className="flex-center gap-05rem margin-bottom-1">
                    <Activity color="var(--color-info)" size={20} className="pulse-cyan" />
                    <h2 className="font-orbitron text-info text-1-2rem uppercase">{t.title}</h2>
                </div>

                {/* Real-time Graphs */}
                <div className="margin-top-1 text-left">
                    <p className="text-07rem text-white-dim mb-1 uppercase">{t.azimuth}</p>
                    <div className="graph-container">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="full-size">
                            <path
                                d={generatePath(history.map(h => h.alpha % 360), 0.5, history[0]?.alpha || 0)}
                                fill="none"
                                stroke="var(--color-info)"
                                strokeWidth="2"
                                className="line-shadow"
                            />
                        </svg>
                        <span className="absolute bottom-1 right-2 text-08rem text-info font-orbitron">
                            {orientation.alpha.toFixed(1)}°
                        </span>
                    </div>

                    <p className="text-07rem text-white-dim mb-1 uppercase">{t.pitch}</p>
                    <div className="graph-container">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="full-size">
                            <path
                                d={generatePath(history.map(h => h.beta), 2, 0)}
                                fill="none"
                                stroke={isWithinRange ? "var(--color-success)" : "var(--color-error)"}
                                strokeWidth="2"
                            />
                            {/* Zero line */}
                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
                        </svg>
                        <span className={`absolute bottom-1 right-2 text-08rem font-orbitron ${isWithinRange ? 'text-success' : 'text-error'}`}>
                            {orientation.beta.toFixed(1)}°
                        </span>
                    </div>
                </div>

                {/* Status List */}
                <div className="margin-top-1-5 text-left">
                    <div className="check-row margin-bottom-05rem">
                        <div className="flex-center gap-08rem">
                            <ShieldCheck size={18} color={isWithinRange ? "var(--color-success)" : "var(--color-error)"} />
                            <span className="text-085rem">{t.normalRange}</span>
                        </div>
                        <span className={isWithinRange ? "text-success" : "text-error"}>
                            {isWithinRange ? "✓" : "!"}
                        </span>
                    </div>

                    <div className="check-row margin-bottom-05rem">
                        <div className="flex-center gap-08rem">
                            <Compass size={18} color={isStable ? "var(--color-success)" : "var(--color-warning)"} />
                            <span className="text-085rem">{t.stability}</span>
                        </div>
                        <span className={isStable ? "text-success" : "text-warning"}>
                            {stabilityScore.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Coaching Feedback */}
                <div className="glass-panel p-1rem margin-top-1-5 bg-black-dim">
                    <p className="text-085rem text-white-dim line-height-15 italic">
                        {!isWithinRange ? t.feedbackStable :
                            !isStable ? t.feedbackFast :
                                t.feedbackIncreasing}
                    </p>
                </div>

                <motion.button
                    disabled={(!isWithinRange || !isStable) && !canOverride}
                    className={`btn-step1 margin-top-2 font-orbitron ${(isWithinRange && isStable) || canOverride ? 'bg-success' : 'opacity-40'}`}
                    onClick={onComplete}
                >
                    PROCEED TO MISSION
                </motion.button>
            </motion.div>
        </div>
    );
};

export default SensorTelemetry;
