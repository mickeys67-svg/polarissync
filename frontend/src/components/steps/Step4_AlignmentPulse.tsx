import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ALIGNMENT_CONFIG } from '../../constants';

interface Step4_Props {
    onComplete: () => void;
    t: {
        title: string;
        subtitle: string;
        coachingTuning: string;
        coachingAligned: string;
        subtext: string;
        button: string;
        detail: string;
        altitude: string;
        azimuth: string;
        up: string;
        down: string;
        left: string;
        right: string;
    };
}

const Step4_AlignmentPulse: React.FC<Step4_Props> = ({ onComplete, t }) => {
    const [hPos, setHPos] = useState(30);
    const [vPos, setVPos] = useState(70);

    // 0.7 Degree Offset Target (Simulated NCP)
    // Offset slightly from the absolute center (50, 50)
    const targetOffset = { x: 53, y: 47 };
    const isAligned = Math.abs(hPos - targetOffset.x) < 1.5 && Math.abs(vPos - targetOffset.y) < 1.5;

    return (
        <div className="responsive-wrapper">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel responsive-padding step-container"
            >
                <h2 className="glow-text-red font-orbitron responsive-h2">{t.title}</h2>
                <p className="text-white-dim" style={{ marginBottom: '3rem' }}>{t.subtitle}</p>

                {/* Dual Pulse Gauge */}
                <div className="pulse-gauge-container" style={{
                    position: 'relative',
                    height: '340px',
                    width: '100%',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Fixed Reference Grid / Circles */}
                    <div className="absolute-center" style={{ width: '200px', height: '200px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                    <div className="absolute-center" style={{ width: '100px', height: '100px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />

                    {/* True NCP Target Circle (0.7° Offset Area) */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: isAligned ? 1 : 0.5, scale: isAligned ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute-center"
                        style={{
                            left: `${targetOffset.x}%`,
                            top: `${targetOffset.y}%`,
                            width: '30px',
                            height: '30px',
                            border: `2px solid ${isAligned ? 'cyan' : 'var(--nebula-red)'}`,
                            borderRadius: '50%',
                            boxShadow: `0 0 10px ${isAligned ? 'cyan' : 'var(--nebula-red)'}`,
                            zIndex: 1
                        }}
                    />
                    <span className="font-orbitron" style={{ position: 'absolute', left: `${targetOffset.x + 4}%`, top: `${targetOffset.y - 4}%`, fontSize: '0.6rem', color: isAligned ? 'cyan' : 'var(--nebula-red)' }}>NCP ({ALIGNMENT_CONFIG.NCP_OFFSET_DEG}°)</span>

                    {/* Horizontal Light Pillar (Altitude Axis) */}
                    <motion.div
                        className="absolute-center"
                        style={{
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${isAligned ? 'cyan' : 'var(--nebula-red)'}, transparent)`,
                            top: `${vPos}%`,
                            boxShadow: `0 0 8px ${isAligned ? 'cyan' : 'var(--nebula-red)'}`,
                            zIndex: 2,
                            opacity: 0.6
                        }}
                    />

                    {/* Vertical Light Pillar (Azimuth Axis) */}
                    <motion.div
                        className="absolute-center"
                        style={{
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: `linear-gradient(0deg, transparent, ${isAligned ? 'cyan' : 'var(--nebula-red)'}, transparent)`,
                            left: `${hPos}%`,
                            boxShadow: `0 0 8px ${isAligned ? 'cyan' : 'var(--nebula-red)'}`,
                            zIndex: 2,
                            opacity: 0.6
                        }}
                    />

                    {/* Precision Crosshair (Polaris Center) */}
                    <motion.div
                        className="absolute-center"
                        style={{
                            left: `${hPos}%`,
                            top: `${vPos}%`,
                            width: '40px',
                            height: '40px',
                            zIndex: 5
                        }}
                    >
                        {/* Polaris Dot */}
                        <div className="absolute-center" style={{ left: '18px', top: '18px', width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 10px white' }} />
                        {/* Precision Crosshair Lines */}
                        <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '1px', background: 'rgba(255,255,255,0.4)' }} />
                        <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '1px', background: 'rgba(255,255,255,0.4)' }} />
                    </motion.div>

                    {/* Intersection Flare */}
                    {isAligned && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 4, 3], opacity: [0, 1, 0.8] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                            className="absolute-center"
                            style={{
                                left: `${hPos}%`,
                                top: `${vPos}%`,
                                width: '50px',
                                height: '50px',
                                background: 'radial-gradient(circle, white 0%, transparent 70%)',
                                zIndex: 3,
                                filter: 'blur(5px)'
                            }}
                        />
                    )}
                </div>

                {/* AI Coaching */}
                <div style={{ marginTop: '2rem' }}>
                    <motion.div
                        key={isAligned ? 'aligned' : 'tuning'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-orbitron"
                        style={{
                            fontSize: '1.1rem',
                            color: isAligned ? 'cyan' : 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        {isAligned ? t.coachingAligned : t.coachingTuning}
                    </motion.div>

                    {/* Guidance Card for Alignment Pulse */}
                    {!isAligned && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel guidance-card"
                            style={{
                                marginTop: '1.2rem',
                                borderLeft: '4px solid var(--nebula-red)',
                                background: 'rgba(255, 0, 0, 0.05)',
                                textAlign: 'left'
                            }}
                        >
                            <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'var(--nebula-red)', display: 'block', marginBottom: '0.3rem' }}>PULSE STABILIZATION</span>
                            <p className="text-white-dim" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                {t.detail}
                            </p>
                        </motion.div>
                    )}

                    {/* Precise Control Sliders */}
                    <div className="flex-column" style={{ marginTop: '2rem', gap: '1.5rem' }}>
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t.azimuth}</span>
                                <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'var(--nebula-red)' }}>{hPos.toFixed(1)}%</span>
                            </div>
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <span className="text-white-dim" style={{ fontSize: '0.6rem', minWidth: '30px' }}>{t.left}</span>
                                <input type="range" value={hPos} min="0" max="100" step="0.1" onChange={(e) => setHPos(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--nebula-red)' }} />
                                <span className="text-white-dim" style={{ fontSize: '0.6rem', minWidth: '30px' }}>{t.right}</span>
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t.altitude}</span>
                                <span className="font-orbitron" style={{ fontSize: '0.7rem', color: 'var(--nebula-red)' }}>{vPos.toFixed(1)}%</span>
                            </div>
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <span className="text-white-dim" style={{ fontSize: '0.6rem', minWidth: '30px' }}>{t.down}</span>
                                <input type="range" value={vPos} min="0" max="100" step="0.1" onChange={(e) => setVPos(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--nebula-red)' }} />
                                <span className="text-white-dim" style={{ fontSize: '0.6rem', minWidth: '30px' }}>{t.up}</span>
                            </div>
                        </div>
                    </div>

                    {isAligned && (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={onComplete}
                            className="glass-panel font-orbitron"
                            style={{
                                marginTop: '2rem',
                                padding: '1.2rem 3rem',
                                background: 'var(--nebula-red)',
                                color: 'white',
                                fontSize: '1.3rem',
                                cursor: 'pointer',
                                border: 'none',
                                boxShadow: '0 0 20px var(--nebula-red)'
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

export default Step4_AlignmentPulse;
