import React, { useState, useEffect } from 'react';
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
        <div style={{ padding: '2rem', width: '100%' }}>
            <motion.div
                onMouseMove={handleMouseMove}
                className="glass-panel"
                style={{
                    width: '90%',
                    maxWidth: '600px',
                    height: '500px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'none',
                    border: `1px solid rgba(255, 0, 0, ${0.1 + gravityEffect * 0.5})`
                }}
            >
                <div style={{ padding: '1.5rem' }}>
                    <h2 className="glow-text-red">{t.title}</h2>
                    <p className="text-white-dim" style={{ fontSize: '0.8rem' }}>{t.subtitle}</p>
                </div>

                {/* Gravity Field Visualizer */}
                <div className="absolute-center full-size pointer-events-none">
                    {/* Ripple / Gravitational Wave */}
                    <motion.div
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 / Math.max(0.1, gravityEffect * 5) }}
                        className="absolute-center"
                        style={{
                            width: '100px',
                            height: '100px',
                            border: '2px solid var(--nebula-red)',
                            borderRadius: '50%',
                            background: 'rgba(255,0,0,0.05)'
                        }}
                    />

                    {/* The Glowing Sun (Target) */}
                    <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--nebula-red)',
                        borderRadius: '50%',
                        boxShadow: `0 0 ${20 + gravityEffect * 40}px var(--nebula-red)`
                    }} />
                </div>

                {/* Space Probe Pointer */}
                <motion.div
                    animate={{ x: probePos.x, y: probePos.y }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '30px',
                        height: '30px',
                        marginLeft: '-15px',
                        marginTop: '-15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        filter: 'drop-shadow(0 0 5px white)'
                    }}
                >
                    <Send size={24} style={{ transform: 'rotate(-45deg)' }} />
                </motion.div>

                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute-center full-size flex-column flex-center glass-panel"
                        style={{
                            background: 'rgba(255,0,0,0.2)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Target size={60} color="white" className="neon-svg" />
                        <h1 className="glow-text-red" style={{ marginTop: '1rem' }}>{t.successTitle}</h1>
                        <div className="font-orbitron" style={{ fontSize: '0.8rem' }}>{t.successSubtitle}</div>
                    </motion.div>
                )}

            </motion.div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', width: '90%', maxWidth: '600px' }}>
                <p className="font-orbitron" style={{ fontSize: '0.9rem', color: isLocked ? 'white' : 'var(--nebula-red)', marginBottom: '1rem' }}>
                    {isLocked ? t.instructionSuccess : t.instruction}
                </p>

                {/* Guidance Card for Event Horizon */}
                {!isLocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel guidance-card"
                    >
                        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <Target size={16} color="var(--nebula-red)" />
                            <span className="font-orbitron text-nebula-red" style={{ fontSize: '0.7rem' }}>TARGETING ASSIST</span>
                        </div>
                        <p className="text-white-dim" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {t.detail}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Step3_EventHorizon;
