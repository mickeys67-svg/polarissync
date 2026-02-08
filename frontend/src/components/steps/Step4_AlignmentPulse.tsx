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
                <p className="text-white-dim step-subtitle">{t.subtitle}</p>

                {/* Dual Pulse Gauge */}
                <div className="pulse-gauge-container">
                    {/* Fixed Reference Grid / Circles */}
                    <div className="absolute-center ref-circle-lg" />
                    <div className="absolute-center ref-circle-sm" />

                    {/* True NCP Target Circle (0.7° Offset Area) */}
                    <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{
                            opacity: isAligned ? 1 : 0.5,
                            scale: isAligned ? [1, 1.1, 1] : 1,
                            borderColor: isAligned ? '#00FFFF' : '#FF0000',
                            boxShadow: `0 0 10px ${isAligned ? '#00FFFF' : '#FF0000'}`
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute-center polaris-target-area ${isAligned ? 'text-cyan' : 'text-nebula-red'}`}
                    />
                    <span className={`font-orbitron ncp-label ncp-label-dynamic ${isAligned ? 'text-cyan' : 'text-nebula-red'}`}>
                        NCP ({ALIGNMENT_CONFIG.NCP_OFFSET_DEG}°)
                    </span>

                    {/* Horizontal Light Pillar (Altitude Axis) */}
                    <motion.div
                        className="absolute-center pillar-h"
                        animate={{
                            background: `linear-gradient(90deg, transparent, ${isAligned ? '#00FFFF' : '#FF0000'}, transparent)`,
                            boxShadow: `0 0 8px ${isAligned ? '#00FFFF' : '#FF0000'}`
                        }}
                    />

                    {/* Vertical Light Pillar (Azimuth Axis) */}
                    <motion.div
                        className="absolute-center pillar-v"
                        animate={{
                            background: `linear-gradient(0deg, transparent, ${isAligned ? '#00FFFF' : '#FF0000'}, transparent)`,
                            boxShadow: `0 0 8px ${isAligned ? '#00FFFF' : '#FF0000'}`
                        }}
                    />

                    {/* Precision Crosshair (Polaris Center) */}
                    <motion.div className="absolute-center precision-crosshair-container">
                        {/* Polaris Dot */}
                        <div className="absolute-center polaris-dot polaris-dot-pos" />
                        {/* Precision Crosshair Lines */}
                        <div className="crosshair-v crosshair-v-pos" />
                        <div className="crosshair-h crosshair-h-pos" />
                    </motion.div>

                    {/* Intersection Flare */}
                    {isAligned && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 4, 3], opacity: [0, 1, 0.8] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                            className="intersection-flare absolute-center flare-pos"
                        />
                    )}
                </div>

                {/* AI Coaching */}
                <div className="alignment-coaching">
                    <motion.div
                        key={isAligned ? 'aligned' : 'tuning'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`font-orbitron coaching-text ${isAligned ? 'text-cyan' : ''}`}
                    >
                        {isAligned ? t.coachingAligned : t.coachingTuning}
                    </motion.div>

                    {/* Guidance Card for Alignment Pulse */}
                    {!isAligned && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel guidance-card guidance-card-step4"
                        >
                            <span className="font-orbitron guidance-header">PULSE STABILIZATION</span>
                            <p className="text-white-dim guidance-detail">
                                {t.detail}
                            </p>
                        </motion.div>
                    )}

                    {/* Precise Control Sliders */}
                    <motion.div
                        className="flex-column slider-section"
                        animate={{
                            '--h-pos': `${hPos}%`,
                            '--v-pos': `${vPos}%`
                        } as any}
                    >
                        <div className="slider-group">
                            <div className="flex-between margin-bottom-05rem">
                                <span className="font-orbitron slider-label-text">{t.azimuth}</span>
                                <span className="font-orbitron slider-value-text">{hPos.toFixed(1)}%</span>
                            </div>
                            <div className="flex-center gap-1rem">
                                <span className="text-white-dim slider-minmax-text">{t.left}</span>
                                <input
                                    type="range"
                                    value={hPos}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    title={t.azimuth}
                                    placeholder={t.azimuth}
                                    onChange={(e) => setHPos(Number(e.target.value))}
                                    className="custom-range flex-1"
                                />
                                <span className="text-white-dim slider-minmax-text">{t.right}</span>
                            </div>
                        </div>
                        <div className="slider-group">
                            <div className="flex-between margin-bottom-05rem">
                                <span className="font-orbitron slider-label-text">{t.altitude}</span>
                                <span className="font-orbitron slider-value-text">{vPos.toFixed(1)}%</span>
                            </div>
                            <div className="flex-center gap-1rem">
                                <span className="text-white-dim slider-minmax-text">{t.down}</span>
                                <input
                                    type="range"
                                    value={vPos}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    title={t.altitude}
                                    placeholder={t.altitude}
                                    onChange={(e) => setVPos(Number(e.target.value))}
                                    className="custom-range flex-1"
                                />
                                <span className="text-white-dim slider-minmax-text">{t.up}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {isAligned && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={onComplete}
                        className="glass-panel font-orbitron btn-alignment-complete"
                    >
                        {t.button}
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default Step4_AlignmentPulse;
