import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Target, Compass } from 'lucide-react';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';

interface Step1_Props {
    onComplete: () => void;
    title: string;
    slogan: string;
    t: any; // Simplified for length, usually specific t object
}

const Step1_Docking: React.FC<Step1_Props> = ({ onComplete, title, slogan, t }) => {
    const [isSynced, setIsSynced] = useState(false);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const { data: orientation, status: sensorStatus, permissionNeeded: needsPermissionClick, startTracking } = useDeviceOrientation();
    const [isChecking, setIsChecking] = useState(false);
    const [isSecure, setIsSecure] = useState(true);
    const [calibrationProgress] = useState(0); // Re-add if used in UI

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

    // Auto-start initialization
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.isSecureContext) setIsSecure(false);
            if (!needsPermissionClick) {
                handleInitialization();
            }
        }
    }, [needsPermissionClick]);

    const handleInitialization = async () => {
        setIsChecking(true);
        setGpsStatus('checking');

        // GPS Check
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setRawData(prev => ({
                        ...prev,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    }));
                    setGpsStatus('success');
                },
                () => setGpsStatus('error'),
                { enableHighAccuracy: true }
            );
        } else {
            setGpsStatus('error');
        }

        await startTracking();
    };

    // Sync state with shared hook data
    useEffect(() => {
        setRawData(prev => ({
            ...prev,
            alpha: orientation.alpha,
            beta: orientation.beta,
            gamma: orientation.gamma,
            displayRotation: orientation.displayRotation,
            isStable: orientation.isStable
        }));
    }, [orientation]);

    const handleSetNorth = () => {
        // Calculate offset so current alpha becomes 0 (North)
        setManualOffset(rawData.alpha);
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
                                <div className={`font-orbitron north-text ${isSynced ? 'text-cyan text-shadow-cyan-glow' : 'text-nebula-red text-shadow-red-glow'}`}>
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
                        className="glass-panel glow-border-red font-orbitron btn-step1 bg-nebula-red-dim border-nebula-red"
                    >
                        {t.btnPermission}
                    </motion.button>
                )}

                {!needsPermissionClick && !isChecking && !isSynced ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleInitialization}
                        className="glass-panel glow-border-red font-orbitron btn-step1 border-nebula-red"
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
                                    <div className="diagnostic-item"><span>FILTER</span><span className="diagnostic-value">ACTIVE</span></div>
                                </div>
                                <div className="margin-top-1 border-top-dim pt-1">
                                    <span className="opacity-50">{t.calcMode}: </span>
                                    <span className="text-white-dim text-065rem">SENSOR SYNCED / {(rawData.displayRotation - manualOffset).toFixed(1)}°</span>
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
                        className="glass-panel glow-border-red font-orbitron btn-step1 bg-nebula-red-dim text-1-2rem border-nebula-red"
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
                    <div className="flex-center margin-bottom-1 flex-start-gap-08">
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
