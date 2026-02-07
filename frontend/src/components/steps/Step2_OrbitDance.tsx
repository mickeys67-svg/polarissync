import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, RotateCw } from 'lucide-react';

interface Step2_Props {
    onComplete: () => void;
    t: {
        title: string;
        subtitle: string;
        confidence: string;
        instruction: string;
        button: string;
        detail: string;
        direction: string;
    };
}

import { ALIGNMENT_CONFIG } from '../../constants';

const Step2_OrbitDance: React.FC<Step2_Props> = ({ onComplete, t }) => {
    const [rotation, setRotation] = useState(0);
    const [trails, setTrails] = useState<{ id: number; angle: number }[]>([]);
    const trailIdCounter = useRef(0);

    // AI Alignment Score simulation
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Simulate rotation change (in reality, this would come from sensors)
        const interval = setInterval(() => {
            setRotation(prev => {
                const next = (prev + ALIGNMENT_CONFIG.ROTATION_SPEED * 4) % 360; // Adjusted for visual speed

                // Add a trail point every few degrees
                if (Math.floor(next / 10) !== Math.floor(prev / 10)) {
                    const id = trailIdCounter.current++;
                    setTrails(t => [...t.slice(-20), { id, angle: next }]);
                }

                // Increase score as we "orbit"
                if (score < 98) setScore(s => s + 0.1);

                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [score]);

    return (
        <div style={{ padding: '2rem', width: '100%' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '2rem', textAlign: 'center', width: '90%', maxWidth: '600px', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="glow-text-red font-orbitron" style={{ fontSize: '1.8rem' }}>{t.title}</h2>
                    <p className="text-white-dim" style={{ fontSize: '0.9rem' }}>{t.subtitle}</p>
                </div>

                {/* Compass Dial Container */}
                <div className="flex-center" style={{ position: 'relative', height: '350px' }}>

                    {/* Static Outer Ring */}
                    <div className="absolute-center" style={{
                        width: '280px',
                        height: '280px',
                        border: '1px solid rgba(255,0,0,0.2)',
                        borderRadius: '50%'
                    }} />

                    {/* Rotating Compass Dial (3D effect) */}
                    <motion.div
                        className="flex-center"
                        style={{
                            position: 'relative',
                            width: '250px',
                            height: '250px',
                            borderRadius: '50%',
                            border: '2px solid var(--nebula-red)',
                            rotate: rotation,
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            boxShadow: '0 0 20px rgba(255,0,0,0.3)'
                        }}
                    >
                        {/* Dynamic Trails */}
                        {trails.map((trail) => (
                            <motion.div
                                key={trail.id}
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 2 }}
                                className="absolute-center"
                                style={{
                                    width: '4px',
                                    height: '4px',
                                    background: 'cyan',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 8px cyan',
                                    transform: `rotate(${trail.angle}deg) translateY(-123px)`
                                }}
                            />
                        ))}

                        <Compass size={40} color="var(--nebula-red)" />

                        {/* Ticks */}
                        {[...Array(12)].map((_, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                width: '2px',
                                height: '10px',
                                background: i % 3 === 0 ? 'var(--nebula-red)' : 'rgba(255,255,255,0.3)',
                                transform: `rotate(${i * 30}deg) translateY(-115px)`
                            }} />
                        ))}
                    </motion.div>

                    {/* AI Score Hologram */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            textAlign: 'right'
                        }}
                    >
                        <div className="font-orbitron" style={{ fontSize: '0.7rem', color: 'cyan' }}>{t.confidence}</div>
                        <div className="font-orbitron" style={{ fontSize: '2.5rem', color: 'white', textShadow: '0 0 10px cyan' }}>
                            {score.toFixed(1)}%
                        </div>
                    </motion.div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <div className="flex-center" style={{ gap: '0.8rem', marginBottom: '1rem' }}>
                        <motion.div
                            animate={{ rotate: [0, 60, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: 'easeInOut',
                                times: [0, 0.5, 1]
                            }}
                        >
                            <RotateCw size={24} color="var(--nebula-red)" />
                        </motion.div>
                        <p className="font-orbitron text-nebula-red" style={{ fontSize: '0.9rem', letterSpacing: '0.1rem' }}>
                            {t.direction}
                        </p>
                    </div>
                    <p className="text-white-dim" style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                        {t.instruction}
                    </p>

                    {/* Guidance Card for Orbit Dance */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel"
                        style={{
                            marginTop: '1.5rem',
                            padding: '1.2rem',
                            borderLeft: '4px solid cyan',
                            background: 'rgba(0, 255, 255, 0.05)',
                            textAlign: 'left'
                        }}
                    >
                        <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <RotateCw size={16} color="cyan" />
                            <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'cyan' }}>ORBIT GUIDE</span>
                        </div>
                        <p className="text-white-dim" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {t.detail}
                        </p>
                    </motion.div>

                    {score > 90 && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onComplete}
                            className="glass-panel glow-border-red font-orbitron"
                            style={{
                                marginTop: '1.5rem',
                                padding: '1rem 2rem',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {t.button}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Step2_OrbitDance;
