import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Target, Compass } from 'lucide-react';

interface Step1_Props {
    onComplete: () => void;
    title: string;
    slogan: string;
    t: {
        status: string;
        system: string;
        ready: string;
        sync: string;
        done: string;
        wait: string;
        button: string;
        footer: string;
        detail: string;
        checkTitle: string;
        checkGps: string;
        checkSensor: string;
        btnCheck: string;
        checking: string;
        rawData: string;
        alpha: string;
        beta: string;
        gamma: string;
        precision: string;
        latLng: string;
        secureWarning: string;
        insecureMsg: string;
        activeEvent: string;
        btnPermission: string;
        calcMode: string;
        calibrating: string;
        stable: string;
        jittery: string;
        btnSetNorth: string;
        manualCalibration: string;
    };
}

const Step1_Docking: React.FC<Step1_Props> = ({ onComplete, title, slogan, t }) => {
    const [isSynced, setIsSynced] = useState(false);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [sensorStatus, setSensorStatus] = useState<'idle' | 'checking' | 'success' | 'error' | 'calibrating'>('idle');
    const [isChecking, setIsChecking] = useState(false);
    const [activeEvent, setActiveEvent] = useState<'none' | 'relative' | 'absolute' | 'ios'>('none');
    const [isSecure, setIsSecure] = useState(true);
    const [needsPermissionClick, setNeedsPermissionClick] = useState(false);
    const [calibrationProgress, setCalibrationProgress] = useState(0);

    // Raw sensor data with filtering
    const [rawData, setRawData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
        lat: 0,
        lng: 0,
        accuracy: 0,
        displayRotation: 0,
        isStable: false
    });

    const [manualOffset, setManualOffset] = useState(0);

    // Refs for filtering and stability
    const lastRotation = useRef<number>(0);
    const sampleBuffer = useRef<number[]>([]);
    const calibrationRetries = useRef<number>(0);
    const smoothingFactor = 0.18; // Slightly more responsive

    // Auto-start initialization
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.isSecureContext) setIsSecure(false);
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                setNeedsPermissionClick(true);
            } else {
                handleInitialization();
            }
        }
    }, []);

    const handleInitialization = async () => {
        setIsChecking(true);
        setNeedsPermissionClick(false);
        setGpsStatus('checking');
        setSensorStatus('calibrating');
        setCalibrationProgress(0);
        calibrationRetries.current = 0;
        sampleBuffer.current = [];

        // GPS Check
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setRawData(prev => ({
                        ...prev,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    }));
                    if (pos.coords.accuracy < 100) {
                        setGpsStatus('success');
                        navigator.geolocation.clearWatch(watchId);
                    }
                },
                (err) => {
                    console.error("GPS Error:", err);
                    setGpsStatus('error');
                    navigator.geolocation.clearWatch(watchId);
                },
                { timeout: 15000, enableHighAccuracy: true }
            );
        } else {
            setGpsStatus('error');
        }

        // Advanced Orientation with Smoothing & Calibration
        const startOrientationTracking = () => {
            let samplesGathered = 0;
            const handleOrientation = (e: any) => {
                let heading = 0;
                let rotateVal = 0;
                let mode: 'none' | 'relative' | 'absolute' | 'ios' = 'none';

                if (e.webkitCompassHeading !== undefined) {
                    heading = e.webkitCompassHeading;
                    rotateVal = -heading;
                    mode = 'ios';
                } else if (e.absolute === true && e.alpha !== null) {
                    heading = e.alpha;
                    rotateVal = heading;
                    mode = 'absolute';
                } else if (e.alpha !== null) {
                    heading = e.alpha;
                    rotateVal = heading;
                    mode = 'relative';
                }

                if (e.alpha !== null || e.webkitCompassHeading !== undefined) {
                    setActiveEvent(mode);

                    // 1. Low-Pass Filter for Smoothing
                    // Handle 0-360 jump for smooth rotation
                    let diff = rotateVal - lastRotation.current;
                    if (diff > 180) lastRotation.current += 360;
                    if (diff < -180) lastRotation.current -= 360;

                    const smoothed = lastRotation.current + (rotateVal - lastRotation.current) * smoothingFactor;
                    lastRotation.current = smoothed;

                    // 2. Stability Sampling for Calibration
                    if (samplesGathered < 30) {
                        samplesGathered++;
                        sampleBuffer.current.push(heading);
                        setCalibrationProgress(Math.floor((samplesGathered / 30) * 100));

                        if (samplesGathered === 30) {
                            // Check variance for stability
                            const mean = sampleBuffer.current.reduce((a: number, b: number) => a + b, 0) / 30;
                            const variance = sampleBuffer.current.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / 30;

                            // Relaxed variance check (15 instead of 5)
                            if (variance < 15 || calibrationRetries.current > 3) {
                                setSensorStatus('success');
                                setRawData(prev => ({ ...prev, isStable: true }));
                            } else {
                                // Jitter detected, retry sampling
                                calibrationRetries.current++;
                                samplesGathered = 0;
                                sampleBuffer.current = [];
                                setCalibrationProgress(0);
                                setRawData(prev => ({ ...prev, isStable: false }));
                            }
                        }
                    }

                    setRawData(prev => ({
                        ...prev,
                        alpha: heading,
                        beta: e.beta || 0,
                        gamma: e.gamma || 0,
                        displayRotation: smoothed
                    }));
                }
            };

            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);

            setTimeout(() => {
                if (samplesGathered < 5) {
                    setSensorStatus('error');
                }
            }, 12000);
        };

        try {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') startOrientationTracking();
                else setSensorStatus('error');
            } else {
                startOrientationTracking();
            }
        } catch (err) {
            console.error(err);
            setSensorStatus('error');
        }
    };

    const handleSetNorth = () => {
        // Calculate offset so current alpha becomes 0 (North)
        setManualOffset(rawData.alpha);
        setSensorStatus('success');
    };

    useEffect(() => {
        if (gpsStatus === 'success' && (sensorStatus === 'success' || sensorStatus === 'error')) {
            const timer = setTimeout(() => setIsSynced(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [gpsStatus, sensorStatus]);


    return (
        <div className="responsive-wrapper">
            {/* Aurora Effect */}
            {isSynced && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="aurora-bg aurora-bg-step1 absolute-center full-size"
                />
            )}

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="glass-panel responsive-padding step-container"
            >
                {!isSecure && (
                    <div className="glass-panel glow-border-red bg-nebula-red-dim secure-warning-panel">
                        <div className="font-orbitron text-nebula-red text-08rem font-bold">⚠️ {t.secureWarning}</div>
                        <div className="text-white-dim text-07rem margin-top-1">{t.insecureMsg}</div>
                    </div>
                )}

                <h1 className="glow-text-red responsive-title">{title}</h1>
                <p className="text-white-dim margin-top-4">
                    {slogan}
                </p>

                <div className="flex-center compass-container">
                    {/* Compass Dial Background - Real North Tracking */}
                    {(isChecking || isSynced) && (
                        <motion.div
                            animate={{
                                rotate: rawData.displayRotation - manualOffset,
                                scale: isSynced ? 1 : 1.1,
                                opacity: isSynced ? 1 : 0.4
                            }}
                            transition={{
                                rotate: { type: 'spring', stiffness: 120, damping: 25 },
                                scale: { duration: 1 }
                            }}
                            className="absolute-center compass-dial"
                            style={{
                                opacity: isSynced ? 1 : 0.4
                            }}
                        >
                            <div className="north-indicator">
                                {/* Bolder Red Arrow ABOVE N */}
                                <svg
                                    width="20"
                                    height="12"
                                    viewBox="0 0 20 12"
                                    className="north-arrow-svg"
                                >
                                    <path d="M10 0L20 12H0L10 0Z" fill="#FF0000" />
                                </svg>
                                <div className={`font-orbitron north-text ${isSynced ? 'text-cyan' : 'text-nebula-red'}`} style={{
                                    textShadow: isSynced ? '0 0 15px cyan' : '0 0 10px rgba(255,0,0,0.8)'
                                }}>
                                    N
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        animate={{ rotateZ: isSynced ? [0, 5, -5, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="smartphone-container"
                    >
                        {/* Semi-transparent Telescope Silhouette BELOW smartphone */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isSynced ? 0.35 : 0.3 }}
                            className="telescope-silhouette"
                        >
                            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="telescope-svg">
                                {/* Telescope pointing UP towards "POLARISSYNC" */}
                                <path d="M45 5 L55 5 L60 80 L40 80 Z" fill="white" fillOpacity="0.7" />
                                <path d="M35 80 L65 80 L72 115 L28 115 Z" fill="white" fillOpacity="0.5" />
                                <circle cx="50" cy="2" r="4" fill="white" />
                                <rect x="30" y="115" width="40" height="4" rx="2" fill="white" fillOpacity="0.8" />
                            </svg>
                        </motion.div>

                        <Smartphone size={70} color={isSynced ? "var(--nebula-red)" : "rgba(255,255,255,0.2)"} className={isSynced ? "neon-svg" : ""} />

                        {isSynced && (
                            <motion.div
                                className="absolute-pos"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Compass size={36} color="cyan" className="cyan-glow-filter" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {needsPermissionClick && !isChecking && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleInitialization}
                        className="glass-panel glow-border-red font-orbitron btn-step1 bg-nebula-red-dim"
                        style={{
                            border: '1px solid var(--nebula-red)'
                        }}
                    >
                        {t.btnPermission}
                    </motion.button>
                )}

                {!needsPermissionClick && !isChecking && !isSynced ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleInitialization}
                        className="glass-panel glow-border-red font-orbitron btn-step1"
                        style={{
                            border: '1px solid var(--nebula-red)'
                        }}
                    >
                        {t.btnCheck}
                    </motion.button>
                ) : (
                    isChecking && (
                        <div className="flex-column check-container">
                            <div className="font-orbitron check-header">{t.checkTitle}</div>

                            <div className="check-row">
                                <span className="text-085rem">{t.checkGps}</span>
                                <span className={`font-orbitron text-09rem ${gpsStatus === 'checking' ? 'text-yellow' : gpsStatus === 'success' ? 'text-cyan' : 'text-nebula-red'}`}>
                                    {gpsStatus === 'checking' ? t.checking : gpsStatus === 'success' ? 'VALIDATED' : 'FAILURE'}
                                </span>
                            </div>

                            <div className="check-row">
                                <span className="text-085rem">{t.checkSensor}</span>
                                <span className={`font-orbitron text-09rem ${sensorStatus === 'calibrating' || sensorStatus === 'checking' ? 'text-yellow' : sensorStatus === 'success' ? 'text-cyan' : 'text-nebula-red'}`}>
                                    {sensorStatus === 'calibrating' ? `${t.calibrating} [${calibrationProgress}%]` : sensorStatus === 'success' ? 'VALIDATED' : 'FAILURE'}
                                </span>
                            </div>

                            {/* Diagnostic Raw Data Panel */}
                            <div className="diagnostic-overlay">
                                <div className="flex-between margin-bottom-1">
                                    <div className="font-orbitron text-06rem text-opacity-40">{t.rawData}</div>
                                    <div className={`font-orbitron text-06rem ${rawData.isStable ? 'text-cyan' : 'text-yellow'}`}>
                                        STATUS: {rawData.isStable ? t.stable : t.jittery}
                                    </div>
                                </div>
                                <div className="diagnostic-grid">
                                    <div className="diagnostic-item"><span>{t.alpha}</span><span className="diagnostic-value">{rawData.alpha.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.beta}</span><span className="diagnostic-value">{rawData.beta.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.gamma}</span><span className="diagnostic-value">{rawData.gamma.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>FILTER</span><span className="diagnostic-value">{(smoothingFactor * 100).toFixed(0)}%</span></div>
                                </div>
                                <div className="margin-top-1 border-top-dim pt-1">
                                    <span className="opacity-50">{t.calcMode}: </span>
                                    <span className="text-white-dim text-065rem">{activeEvent.toUpperCase()} / CALC: {(rawData.displayRotation - manualOffset).toFixed(1)}°</span>
                                </div>
                            </div>

                            {/* Manual Calibration Button */}
                            {sensorStatus === 'calibrating' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-column manual-cal-group"
                                >
                                    <div className="text-white-dim text-opacity-60 italic-text text-075rem">
                                        * {t.manualCalibration}
                                    </div>
                                    <button
                                        onClick={handleSetNorth}
                                        className="glass-panel manual-cal-btn"
                                    >
                                        {t.btnSetNorth}
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )
                )}

                {isSynced && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onComplete}
                        className="glass-panel glow-border-red font-orbitron btn-step1 bg-nebula-red-dim"
                        style={{
                            fontSize: '1.2rem',
                            border: '1px solid var(--nebula-red)'
                        }}
                    >
                        {t.button}
                    </motion.button>
                )}
            </motion.div>

            {isSynced && (
                <div className="footer-container">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glow-text-red font-orbitron blink-text footer-text"
                    >
                        {t.footer}
                    </motion.div>
                </div>
            )}

            {isSynced && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel guidance-card margin-top-4"
                >
                    <div className="flex-center margin-bottom-1" style={{ justifyContent: 'flex-start', gap: '0.8rem' }}>
                        <Target size={18} color="var(--nebula-red)" />
                        <span className="font-orbitron text-nebula-red guidance-mission-header">MISSION GUIDANCE</span>
                    </div>
                    <p className="text-white-dim text-09rem line-height-14 text-left">
                        {t.detail}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Step1_Docking;
