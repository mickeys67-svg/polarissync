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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'cyan';
            case 'error': return 'var(--nebula-red)';
            case 'calibrating': return 'yellow';
            case 'checking': return 'yellow';
            default: return 'rgba(255,255,255,0.3)';
        }
    };

    return (
        <div className="responsive-wrapper" style={{ overscrollBehavior: 'none' }}>
            {/* Aurora Effect */}
            {isSynced && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="aurora-bg absolute-center full-size"
                    style={{
                        inset: '-50px',
                        background: 'radial-gradient(circle at center, var(--nebula-red) 0%, transparent 70%)',
                        filter: 'blur(100px)',
                        zIndex: -1
                    }}
                />
            )}

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="glass-panel responsive-padding"
                style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
            >
                {!isSecure && (
                    <div className="glass-panel glow-border-red" style={{ marginBottom: '1.5rem', background: 'rgba(255,0,0,0.1)', padding: '0.8rem' }}>
                        <div className="font-orbitron text-nebula-red" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ {t.secureWarning}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.3rem' }}>{t.insecureMsg}</div>
                    </div>
                )}

                <h1 className="glow-text-red responsive-title">{title}</h1>
                <p className="text-white-dim" style={{ marginBottom: '2rem' }}>
                    {slogan}
                </p>

                <div className="flex-center" style={{ position: 'relative', height: '180px', width: '100%' }}>
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
                            className="absolute-center"
                            style={{
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%',
                                border: '1px dashed rgba(255, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingTop: '10px',
                                position: 'absolute'
                            }}
                        >
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Bolder Red Arrow ABOVE N */}
                                <svg
                                    width="20"
                                    height="12"
                                    viewBox="0 0 20 12"
                                    style={{
                                        marginBottom: '0px',
                                        filter: 'drop-shadow(0 0 8px var(--nebula-red))',
                                        zIndex: 10
                                    }}
                                >
                                    <path d="M10 0L20 12H0L10 0Z" fill="#FF0000" />
                                </svg>
                                <div className="font-orbitron" style={{
                                    color: isSynced ? 'cyan' : '#FF0000',
                                    fontSize: '1.3rem',
                                    fontWeight: '900',
                                    textShadow: isSynced ? '0 0 15px cyan' : '0 0 10px rgba(255,0,0,0.8)',
                                    marginTop: '-2px'
                                }}>
                                    N
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        animate={{ rotateZ: isSynced ? [0, 5, -5, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {/* Semi-transparent Telescope Silhouette BELOW smartphone */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isSynced ? 0.35 : 0.3 }}
                            style={{
                                position: 'absolute',
                                width: '150px',
                                height: '180px',
                                top: '80%', // Move down
                                left: '50%',
                                transform: 'translate(-50%, -20%)',
                                zIndex: -1
                            }}
                        >
                            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>
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
                                style={{ position: 'absolute' }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Compass size={36} color="cyan" style={{ filter: 'drop-shadow(0 0 5px cyan)' }} />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {needsPermissionClick && !isChecking && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleInitialization}
                        className="glass-panel glow-border-red font-orbitron"
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '1.2rem',
                            color: 'white',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            background: 'rgba(255, 0, 0, 0.1)',
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
                        className="glass-panel glow-border-red font-orbitron"
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '1.2rem',
                            color: 'white',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            border: '1px solid var(--nebula-red)'
                        }}
                    >
                        {t.btnCheck}
                    </motion.button>
                ) : (
                    isChecking && (
                        <div className="flex-column" style={{ marginTop: '1.5rem', gap: '0.4rem' }}>
                            <div className="font-orbitron" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', letterSpacing: '0.1rem' }}>{t.checkTitle}</div>

                            <div className="flex-center" style={{ justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem' }}>{t.checkGps}</span>
                                <span className="font-orbitron" style={{ color: getStatusColor(gpsStatus), fontSize: '0.9rem' }}>
                                    {gpsStatus === 'checking' ? t.checking : gpsStatus === 'success' ? 'VALIDATED' : 'FAILURE'}
                                </span>
                            </div>

                            <div className="flex-center" style={{ justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem' }}>{t.checkSensor}</span>
                                <span className="font-orbitron" style={{ color: getStatusColor(sensorStatus), fontSize: '0.9rem' }}>
                                    {sensorStatus === 'calibrating' ? `${t.calibrating} [${calibrationProgress}%]` : sensorStatus === 'success' ? 'VALIDATED' : 'FAILURE'}
                                </span>
                            </div>

                            {/* Diagnostic Raw Data Panel */}
                            <div className="diagnostic-overlay">
                                <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <div className="font-orbitron" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>{t.rawData}</div>
                                    <div className="font-orbitron" style={{ color: rawData.isStable ? 'cyan' : 'yellow', fontSize: '0.6rem' }}>
                                        STATUS: {rawData.isStable ? t.stable : t.jittery}
                                    </div>
                                </div>
                                <div className="diagnostic-grid">
                                    <div className="diagnostic-item"><span>{t.alpha}</span><span className="diagnostic-value">{rawData.alpha.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.beta}</span><span className="diagnostic-value">{rawData.beta.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.gamma}</span><span className="diagnostic-value">{rawData.gamma.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>FILTER</span><span className="diagnostic-value">{(smoothingFactor * 100).toFixed(0)}%</span></div>
                                </div>
                                <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.3rem' }}>
                                    <span style={{ opacity: 0.5 }}>{t.calcMode}: </span>
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem' }}>{activeEvent.toUpperCase()} / CALC: {(rawData.displayRotation - manualOffset).toFixed(1)}°</span>
                                </div>
                            </div>

                            {/* Manual Calibration Button */}
                            {sensorStatus === 'calibrating' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-column"
                                    style={{ gap: '0.5rem', marginTop: '0.5rem' }}
                                >
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                                        * {t.manualCalibration}
                                    </div>
                                    <button
                                        onClick={handleSetNorth}
                                        className="glass-panel"
                                        style={{
                                            padding: '0.8rem',
                                            fontSize: '0.9rem',
                                            color: 'cyan',
                                            border: '1px solid rgba(0, 255, 255, 0.3)',
                                            background: 'rgba(0, 255, 255, 0.05)',
                                            width: '100%',
                                            cursor: 'pointer'
                                        }}
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
                        className="glass-panel glow-border-red font-orbitron"
                        style={{
                            marginTop: '2rem',
                            width: '100%',
                            padding: '1.2rem',
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            background: 'rgba(255, 0, 0, 0.1)',
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
                        className="glow-text-red font-orbitron blink-text"
                        style={{ letterSpacing: '0.3rem', fontSize: '1.1rem' }}
                    >
                        {t.footer}
                    </motion.div>
                </div>
            )}

            {isSynced && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel guidance-card"
                    style={{ marginTop: '2rem' }}
                >
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.8rem', marginBottom: '0.5rem' }}>
                        <Target size={18} color="var(--nebula-red)" />
                        <span className="font-orbitron text-nebula-red" style={{ fontSize: '0.75rem', letterSpacing: '0.1rem' }}>MISSION GUIDANCE</span>
                    </div>
                    <p className="text-white-dim" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'left' }}>
                        {t.detail}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Step1_Docking;
