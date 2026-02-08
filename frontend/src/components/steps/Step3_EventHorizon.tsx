import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Target } from 'lucide-react';

interface Step3_Props {
    onComplete: () => void;
    t: {
        title: string;
        subtitle: string;
        successTitle: string;
        successSubtitle: string;
        instruction: string;
        instructionSuccess: string;
        detail: string;
    };
}

const Step3_EventHorizon: React.FC<Step3_Props> = ({ onComplete, t }) => {
    const [probePos, setProbePos] = useState({ x: -100, y: -100 });
    const [isLocked, setIsLocked] = useState(false);

    // Mouse interaction or simulated sensor movement
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isLocked) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setProbePos({ x, y });

        // Distance to center (The Glowing Sun / North Pole)
        const dist = Math.sqrt(x * x + y * y);
        if (dist < 10) {
            setIsLocked(true);
            setTimeout(onComplete, 2500);
        }
    };

    const distToCenter = Math.sqrt(probePos.x * probePos.x + probePos.y * probePos.y);
    const gravityEffect = Math.max(0, (1 - distToCenter / 200));

    return (
        <div className="responsive-wrapper">
            <motion.div
                onMouseMove={handleMouseMove}
                animate={{
                    borderColor: `rgba(255, 0, 0, ${0.1 + gravityEffect * 0.5})`
                }}
                className="glass-panel step-container event-horizon-visual"
            >
                <div className="responsive-padding">
                    <h2 className="glow-text-red responsive-h2">{t.title}</h2>
                    <p className="text-white-dim text-08rem">{t.subtitle}</p>
                </div>

                {/* Gravity Field Visualizer */}
                <div className="absolute-center full-size pointer-events-none">
                    {/* Ripple / Gravitational Wave */}
                    <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 / Math.max(0.1, gravityEffect * 5) }}
                        className="absolute-center grav-ripple"
                    />

                    {/* The Glowing Sun (Target) */}
                    <motion.div
                        className="target-sun"
                        animate={{
                            boxShadow: `0 0 ${20 + gravityEffect * 40}px #FF0000`
                        }}
                    />
                </div>

                {/* Space Probe Pointer */}
                <motion.div
                    animate={{ x: probePos.x, y: probePos.y }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="probe-pointer"
                >
                    <Send size={24} className="rotate-minus-45" />
                </motion.div>

                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute-center full-size flex-column flex-center glass-panel bg-nebula-red-dim-2 blur-10px"
                    >
                        <Target size={60} color="white" className="neon-svg" />
                        <h1 className="glow-text-red margin-top-1rem">{t.successTitle}</h1>
                        <div className="font-orbitron text-08rem">{t.successSubtitle}</div>
                    </motion.div>
                )}

            </motion.div>

            <div className="margin-top-1-5rem text-center full-width max-width-600 center-block">
                <p className={`font-orbitron text-09rem margin-bottom-1 ${isLocked ? 'text-white' : 'text-nebula-red'}`}>
                    {isLocked ? t.instructionSuccess : t.instruction}
                </p>

                {/* Guidance Card for Event Horizon */}
                {!isLocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel guidance-card"
                    >
                        <div className="flex-center flex-start gap-05rem margin-bottom-03rem">
                            <Target size={16} color="var(--nebula-red)" />
                            <span className="font-orbitron text-nebula-red text-07rem">TARGETING ASSIST</span>
                        </div>
                        <p className="text-white-dim text-085rem line-height-14">
                            {t.detail}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Step3_EventHorizon;
