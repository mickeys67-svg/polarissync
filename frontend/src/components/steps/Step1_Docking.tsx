import React, { useState, useEffect } from 'react';
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
    };
}

const Step1_Docking: React.FC<Step1_Props> = ({ onComplete, title, slogan, t }) => {
    const [isSynced, setIsSynced] = useState(false);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [sensorStatus, setSensorStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [isChecking, setIsChecking] = useState(false);
    const [activeEvent, setActiveEvent] = useState<'none' | 'relative' | 'absolute' | 'ios'>('none');
    const [isSecure, setIsSecure] = useState(true);
    const [needsPermissionClick, setNeedsPermissionClick] = useState(false);

    // Raw sensor data for debug
    const [rawData, setRawData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
        lat: 0,
        lng: 0,
        accuracy: 0,
        displayRotation: 0
    });

    // Auto-start initialization on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.isSecureContext) setIsSecure(false);

            // Check if iOS permission is likely needed
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                setNeedsPermissionClick(true);
            } else {
                // Auto-start for Android/Desktop
                handleInitialization();
            }
        }
    }, []);

    const handleInitialization = async () => {
        setIsChecking(true);
        setNeedsPermissionClick(false);
        setGpsStatus('checking');
        setSensorStatus('checking');

        // 1. Check GPS
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

        // 2. Fixed Orientation Logic
        const startOrientationTracking = () => {
            let eventCount = 0;
            const handleOrientation = (e: any) => {
                let heading = 0;
                let rotateVal = 0;
                let mode: 'none' | 'relative' | 'absolute' | 'ios' = 'none';

                if (e.webkitCompassHeading !== undefined) {
                    // iOS: webkitCompassHeading is CW 0-360.
                    // To keep N fixed, we must rotate dial CCW by the heading.
                    heading = e.webkitCompassHeading;
                    rotateVal = -heading;
                    mode = 'ios';
                } else if (e.absolute === true && e.alpha !== null) {
                    // Android Absolute: alpha is CCW 0-360.
                    // To keep N fixed, we rotate dial CW by alpha (standard rotation is CW in CSS).
                    heading = e.alpha;
                    rotateVal = heading;
                    mode = 'absolute';
                } else if (e.alpha !== null) {
                    // Standard Alpha
                    heading = e.alpha;
                    rotateVal = heading;
                    mode = 'relative';
                }

                if (e.alpha !== null || e.webkitCompassHeading !== undefined) {
                    eventCount++;
                    setActiveEvent(mode);
                    setRawData(prev => ({
                        ...prev,
                        alpha: heading,
                        beta: e.beta || 0,
                        gamma: e.gamma || 0,
                        displayRotation: rotateVal
                    }));

                    if (eventCount > 10) {
                        setSensorStatus('success');
                    }
                }
            };

            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);

            setTimeout(() => {
                if (eventCount < 5) {
                    console.error("Sensor connection failed. Events:", eventCount);
                    setSensorStatus('error');
                }
            }, 10000);
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
            console.error("Permission Error:", err);
            setSensorStatus('error');
        }
    };

    useEffect(() => {
        if (gpsStatus === 'success' && sensorStatus === 'success') {
            const timer = setTimeout(() => setIsSynced(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [gpsStatus, sensorStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'cyan';
            case 'error': return 'var(--nebula-red)';
            case 'checking': return 'yellow';
            default: return 'rgba(255,255,255,0.3)';
        }
    };

    return (
        <div className="responsive-wrapper">
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
                                rotate: rawData.displayRotation,
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
                            <div className="font-orbitron" style={{
                                color: isSynced ? 'cyan' : 'var(--nebula-red)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textShadow: isSynced ? '0 0 10px cyan' : 'none'
                            }}>
                                N
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        animate={{ rotateZ: isSynced ? [0, 5, -5, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
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
                                    {gpsStatus === 'checking' ? t.checking : gpsStatus === 'success' ? 'VALIDATED' : gpsStatus === 'error' ? 'FAILURE' : '-'}
                                </span>
                            </div>

                            <div className="flex-center" style={{ justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem' }}>{t.checkSensor}</span>
                                <span className="font-orbitron" style={{ color: getStatusColor(sensorStatus), fontSize: '0.9rem' }}>
                                    {sensorStatus === 'checking' ? t.checking : sensorStatus === 'success' ? 'VALIDATED' : sensorStatus === 'error' ? 'FAILURE' : '-'}
                                </span>
                            </div>

                            {/* Diagnostic Raw Data Panel */}
                            <div className="diagnostic-overlay">
                                <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                    <div className="font-orbitron" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>{t.rawData}</div>
                                    <div className="font-orbitron" style={{ color: activeEvent === 'none' ? 'gray' : 'cyan', fontSize: '0.6rem' }}>{t.activeEvent}: {activeEvent.toUpperCase()}</div>
                                </div>
                                <div className="diagnostic-grid">
                                    <div className="diagnostic-item"><span>{t.alpha}</span><span className="diagnostic-value">{rawData.alpha.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.beta}</span><span className="diagnostic-value">{rawData.beta.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.gamma}</span><span className="diagnostic-value">{rawData.gamma.toFixed(1)}°</span></div>
                                    <div className="diagnostic-item"><span>{t.precision}</span><span className="diagnostic-value">{rawData.accuracy.toFixed(0)}m</span></div>
                                </div>
                                <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.3rem' }}>
                                    <span style={{ opacity: 0.5 }}>{t.calcMode}: </span>
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem' }}>{activeEvent.toUpperCase()} / CALC: {rawData.displayRotation.toFixed(1)}°</span>
                                </div>
                            </div>
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
