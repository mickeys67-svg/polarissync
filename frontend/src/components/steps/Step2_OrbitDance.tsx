import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, RotateCw } from 'lucide-react';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';

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
        lockOrientation: string;
        lockButton: string;
    };
}



const Step2_OrbitDance: React.FC<Step2_Props> = ({ onComplete, t }) => {
    const [rotation, setRotation] = useState(0);
    const [trails, setTrails] = useState<{ id: number; angle: number }[]>([]);
    const trailIdCounter = useRef(0);

    // AI Alignment Score simulation
    const [score, setScore] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const toggleLock = async () => {
        try {
            if (!isLocked) {
                if ((screen.orientation as any) && (screen.orientation as any).lock) {
                    await (screen.orientation as any).lock('portrait');
                }
                setIsLocked(true);
                startTracking();
            } else {
                if ((screen.orientation as any) && (screen.orientation as any).unlock) {
                    (screen.orientation as any).unlock();
                }
                setIsLocked(false);
                setStartAlpha(null);
                setScore(0);
                setRotation(0);
            }
        } catch (err) {
            console.error("Orientation lock failed:", err);
            // Fallback for desktop or non-supporting browsers
            setIsLocked(!isLocked);
            if (!isLocked) startTracking();
        }
    };

    const resetSensor = () => {
        setStartAlpha(orientation.displayRotation);
        setScore(0);
        setRotation(0);
    };

    const [startAlpha, setStartAlpha] = useState<number | null>(null);
    const { data: orientation, status: sensorStatus, startTracking } = useDeviceOrientation();

    useEffect(() => {
        if (isLocked) {
            startTracking();
        }
    }, [isLocked, startTracking]);

    useEffect(() => {
        if (!isLocked || sensorStatus !== 'success' || startAlpha !== null) return;

        // Wait for sensor to be stable before setting the reference point
        if (orientation.isStable) {
            setStartAlpha(orientation.displayRotation);
        }
    }, [isLocked, sensorStatus, orientation.displayRotation, orientation.isStable, startAlpha]);

    useEffect(() => {
        if (!isLocked || sensorStatus !== 'success' || startAlpha === null) return;

        // Calculate delta rotation using smoothed displayRotation
        let delta = orientation.displayRotation - startAlpha;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        // Visual feedback
        setRotation(delta);

        // Progress logic: target 60 degrees rotation = 100%
        const TARGET_ANGLE = 60;
        const currentDelta = Math.abs(delta);

        // Logic Guard: Prevent sudden jumps from noise
        // If the movement is too extreme (e.g. > 45 deg in one frame), ignore it
        if (Math.abs(currentDelta - Math.abs(rotation)) > 45) return;

        const progress = Math.min((currentDelta / TARGET_ANGLE) * 100, 100);
        setScore(progress);

        // Add trail points based on movement
        const currentAngle = Math.floor(delta);
        if (trails.length === 0 || Math.abs(currentAngle - trails[trails.length - 1].angle) > 3) {
            const id = trailIdCounter.current++;
            setTrails(t => [...t.slice(-30), { id, angle: delta }]);
        }
    }, [orientation.displayRotation, isLocked, sensorStatus, startAlpha, trails.length, rotation]);

    // Cleanup: unlock orientation when leaving step
    useEffect(() => {
        return () => {
            if ((screen.orientation as any) && (screen.orientation as any).unlock) {
                (screen.orientation as any).unlock();
            }
        };
    }, []);

    return (
        <div className="responsive-wrapper">
            <div className="flex-center full-width gap-1rem margin-bottom-1rem">
                <button
                    className={`orientation-button font-orbitron ${isLocked ? 'active' : ''}`}
                    onClick={toggleLock}
                >
                    {isLocked ? "PORTRAIT LOCKED" : t.lockButton}
                </button>
                {isLocked && (
                    <button
                        className="reset-button font-orbitron"
                        onClick={resetSensor}
                        style={{ marginTop: 0 }}
                    >
                        RESET (0°)
                    </button>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel responsive-padding step-container"
            >
                <div className="margin-bottom-2rem">
                    <h2 className="glow-text-red font-orbitron responsive-h2">{t.title}</h2>
                    <p className="text-white-dim text-09rem">{t.subtitle}</p>
                </div>

                {/* Compass Dial Container */}
                <div className="flex-center orbit-dial-container">

                    {/* Static Outer Ring */}
                    <div className="absolute-center orbit-ring-outer" />

                    {/* Rotating Compass Dial (3D effect) */}
                    <motion.div
                        className="flex-center orbit-compass-dial"
                        animate={{ rotate: rotation }}
                    >
                        {/* Dynamic Trails */}
                        {trails.map((trail) => (
                            <motion.div
                                key={trail.id}
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 0, rotate: trail.angle, y: -123 }}
                                transition={{ duration: 2 }}
                                className="absolute-center orbit-trail-point"
                            />
                        ))}

                        <Compass size={40} color="var(--nebula-red)" />

                        {/* Ticks */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="orbit-tick"
                                animate={{
                                    backgroundColor: i % 3 === 0 ? '#FF0000' : 'rgba(255,255,255,0.3)',
                                    rotate: i * 30,
                                    y: -115
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* AI Score Hologram */}
                    <motion.div className="score-hologram-pos">
                        <div className="font-orbitron text-cyan text-07rem letter-spacing-02">{t.confidence}</div>
                        <div className="font-orbitron text-3rem text-white text-shadow-cyan font-weight-800">
                            {score.toFixed(1)}%
                        </div>
                        <div className="flex-center gap-05rem margin-top-03rem">
                            <div className={`status-dot ${isLocked ? 'pulse-cyan' : 'bg-red'}`} />
                            <span className="text-06rem text-white-dim uppercase">{sensorStatus}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Sensor Diagnostics Dashboard */}
                <div className="sensor-dashboard glass-panel">
                    <div className="diagnostic-item">
                        <span className="label">AZIMUTH (α)</span>
                        <span className="value cyan">{orientation.alpha.toFixed(1)}°</span>
                    </div>
                    <div className="diagnostic-item">
                        <span className="label">PITCH (β)</span>
                        <span className="value">{orientation.beta.toFixed(1)}°</span>
                    </div>
                    <div className="diagnostic-item">
                        <span className="label">STABILITY</span>
                        <span className={`value ${orientation.isStable ? 'text-green' : 'text-red'}`}>
                            {orientation.isStable ? "STABLE" : "MOVING"}
                        </span>
                    </div>
                </div>

                <div className="margin-top-2">
                    <div className="flex-center gap-1rem margin-bottom-1">
                        <motion.div
                            animate={{
                                rotate: [0, 60, 0],
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: 'easeInOut'
                            }}
                            className="neon-icon-border"
                        >
                            <RotateCw size={28} color="var(--nebula-red)" />
                        </motion.div>
                        <div className="text-left">
                            <p className="font-orbitron text-nebula-red text-1rem font-weight-700 letter-spacing-01">
                                {t.direction}
                            </p>
                            <p className="text-white-dim text-075rem italic">Target: 60.0° Rotation</p>
                        </div>
                    </div>
                    <p className="text-white-dim text-085rem margin-bottom-1-5rem line-height-15">
                        {t.instruction}
                    </p>

                    {/* Guidance Card for Orbit Dance */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel orbit-guidance-card"
                    >
                        <div className="flex-center flex-start-gap-05 margin-bottom-03rem">
                            <RotateCw size={16} color="cyan" />
                            <span className="font-orbitron text-cyan text-07rem">ORBIT GUIDE</span>
                        </div>
                        <p className="text-white-dim text-085rem line-height-14">
                            {t.detail}
                        </p>
                    </motion.div>

                    {/* Progress Bar (Deducted from original logic) */}
                    <div className="margin-top-1-5rem bg-white-dim-05 full-width orbit-score-gauge">
                        <motion.div
                            className="full-height bg-nebula-red-dim"
                            animate={{ width: score + '%' }}
                        />
                    </div>

                    {score > 90 && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onComplete}
                            className="glass-panel glow-border-red font-orbitron btn-step2-complete"
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
