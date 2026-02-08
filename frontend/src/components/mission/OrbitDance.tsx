import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSensorData } from '../../hooks/useSensorData';
import { physics } from '../../utils/physics';
import { missionService } from '../../services/api';
import { useMissionStore } from '../../store/missionStore';

interface OrbitDanceProps {
    onComplete: () => void;
}

export const OrbitDance: React.FC<OrbitDanceProps> = ({ onComplete }) => {
    const { sensorData, isStable, stdDev } = useSensorData();
    const { mission } = useMissionStore();
    const [initialAlpha, setInitialAlpha] = useState<number | null>(null);
    const [currentRotation, setCurrentRotation] = useState(0);
    const [confidence, setConfidence] = useState(0);
    const telemetryRef = useRef<any[]>([]);

    const TARGET_ANGLE = 60;

    // Initial setup: Lock the starting angle when the sensor is first stable
    useEffect(() => {
        if (initialAlpha === null && sensorData.alpha !== 0 && isStable) {
            setInitialAlpha(sensorData.alpha);
            console.log('Orbit Dance: Initial Alpha locked at', sensorData.alpha);
        }
    }, [sensorData.alpha, initialAlpha, isStable]);

    // Rotation & Confidence calculation
    useEffect(() => {
        if (initialAlpha === null) return;

        let delta = sensorData.alpha - initialAlpha;
        // Wrap around 360 boundary for physical rotation
        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;

        const rotation = Math.abs(delta);
        setCurrentRotation(rotation);

        // Dynamic Confidence calculation
        const conf = physics.calculateConfidence({
            rotation,
            stdDev,
            gpsAccuracy: 10,
            isStable,
            sampleCount: 150
        });
        setConfidence(conf);

        // Auto-complete triggers when goal is met with high stability
        if (rotation >= TARGET_ANGLE && conf >= 90) {
            console.log('Goal reached! Finalizing alignment...');
            const timer = setTimeout(onComplete, 2000);
            return () => clearTimeout(timer);
        }
    }, [sensorData.alpha, initialAlpha, stdDev, isStable, onComplete]);

    // Real-time Telemetry Sync to Backend
    useEffect(() => {
        if (!mission.id || !isStable) return;

        const reading = {
            alpha: sensorData.alpha,
            beta: sensorData.beta,
            gamma: sensorData.gamma,
            timestamp: sensorData.timestamp
        };

        telemetryRef.current.push(reading);

        // Flush batch every 10 samples to optimize network
        if (telemetryRef.current.length >= 10) {
            const batch = [...telemetryRef.current];
            telemetryRef.current = [];
            missionService.updateTelemetry(mission.id!, batch).catch(err => {
                console.warn('Backend telemetry sync failed:', err);
            });
        }
    }, [sensorData, mission.id, isStable]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] p-6 font-inter">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl"
            >
                {/* Status Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-orbitron font-bold text-cyan-400">ORBIT DANCE</h2>
                        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Phase 3: RA Axis Sync</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <div className={`w-2 h-2 rounded-full ${isStable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[9px] font-orbitron text-white/60 tracking-widest">{isStable ? 'LOCKED' : 'DRIFT'}</span>
                    </div>
                </div>

                {/* Circular Gauge */}
                <div className="relative w-72 h-72 mx-auto mb-8 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="144" cy="144" r="130" className="stroke-white/5 fill-none" strokeWidth="2" />
                        <circle cx="144" cy="144" r="115" className="stroke-white/5 fill-none" strokeWidth="8" />

                        <motion.circle
                            cx="144"
                            cy="144"
                            r="115"
                            className="stroke-cyan-500 fill-none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={722}
                            animate={{ strokeDashoffset: 722 - (722 * Math.min(currentRotation, TARGET_ANGLE)) / TARGET_ANGLE }}
                            transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            key={Math.round(currentRotation)}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-orbitron font-bold text-white tracking-tighter"
                        >
                            {Math.round(currentRotation)}°
                        </motion.span>
                        <span className="text-[11px] text-white/40 uppercase tracking-[0.4em] mt-1">SWING</span>
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Target</span>
                        <span className="text-lg font-orbitron text-white">{TARGET_ANGLE}°</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Stability</span>
                        <span className={`text-lg font-orbitron ${isStable ? 'text-green-400' : 'text-yellow-500'}`}>
                            {isStable ? 'HIGH' : 'LOW'}
                        </span>
                    </div>
                </div>

                {/* Confidence Meter */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold font-orbitron">CONFIDENCE INDEX</span>
                        <span className={`text-sm font-orbitron ${confidence > 90 ? 'text-green-400' : 'text-cyan-400'}`}>{confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full p-0.5 border border-white/5 overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${confidence > 90 ? 'bg-green-400' : 'bg-cyan-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence}%` }}
                            transition={{ type: "spring", stiffness: 30 }}
                        />
                    </div>
                </div>

                {/* Dynamic Instructions */}
                <div className="mt-8 text-center bg-cyan-500/5 py-4 rounded-2xl border border-cyan-500/10">
                    <p className="text-[11px] font-bold text-cyan-400/80 uppercase tracking-widest animate-pulse">
                        {!isStable ? "❌ KEEP TELESCOPE STEADY" :
                            currentRotation < TARGET_ANGLE ? "✔ ROTATE SLOWLY CLOCKWISE" :
                                confidence < 90 ? "✦ HOLD POSITION FOR SYNC..." : "READY TO ARCHIVE"}
                    </p>
                </div>
            </motion.div>

            <div className="mt-8 text-center max-w-xs opacity-40">
                <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                    ASTRONOMICAL DATA PERSISTED VIA POLARISSYNC ENSEMBLE CORE.
                </p>
            </div>
        </div>
    );
};
