import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Target, Cpu, Compass } from 'lucide-react';

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
    };
}

const Step1_Docking: React.FC<Step1_Props> = ({ onComplete, title, slogan, t }) => {
    const [isSynced, setIsSynced] = useState(false);
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [sensorStatus, setSensorStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [isChecking, setIsChecking] = useState(false);

    const handleInitialization = async () => {
        setIsChecking(true);
        setGpsStatus('checking');
        setSensorStatus('checking');

        // 1. Check GPS
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => setGpsStatus('success'),
                (err) => {
                    console.error("GPS Error:", err);
                    setGpsStatus('error');
                },
                { timeout: 5000 }
            );
        } else {
            setGpsStatus('error');
        }

        // 2. Check Orientation Sensors
        try {
            // iOS 13+ requires explicit permission
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setSensorStatus('success');
                } else {
                    setSensorStatus('error');
                }
            } else {
                // Android or older iOS - usually granted by default
                // We add a small delay to simulate scanning
                setTimeout(() => setSensorStatus('success'), 1500);
            }
        } catch (err) {
            console.error("Sensor Error:", err);
            setSensorStatus('error');
        }
    };

    useEffect(() => {
        if (gpsStatus === 'success' && sensorStatus === 'success') {
            setIsSynced(true);
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
            {/* Aurora Effect - Only show when synced */}
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
                <h1 className="glow-text-red responsive-title">{title}</h1>
                <p className="text-white-dim" style={{ marginBottom: '2rem' }}>
                    {slogan}
                </p>

                <div className="flex-center" style={{ position: 'relative', height: '200px', width: '100%' }}>
                    {/* Compass Dial Background - Only show N when synced or checking */}
                    {(isChecking || isSynced) && (
                        <motion.div
                            animate={{
                                rotate: isSynced ? 0 : 360,
                                scale: isSynced ? 1 : 1.1,
                                opacity: isSynced ? 1 : 0.3
                            }}
                            transition={{
                                rotate: { repeat: isSynced ? 0 : Infinity, duration: 10, ease: "linear" },
                                scale: { duration: 1 }
                            }}
                            className="absolute-center"
                            style={{
                                width: '180px',
                                height: '180px',
                                borderRadius: '50%',
                                border: '1px dashed rgba(255, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingTop: '5px',
                                position: 'absolute'
                            }}
                        >
                            <div className="font-orbitron text-nebula-red" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>N</div>
                        </motion.div>
                    )}

                    {/* Smartphone Icon with inner Compass */}
                    <motion.div
                        animate={{ rotateZ: isSynced ? [0, 5, -5, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Smartphone size={80} color={isSynced ? "var(--nebula-red)" : "rgba(255,255,255,0.2)"} className={isSynced ? "neon-svg" : ""} />

                        {isSynced && (
                            <motion.div
                                style={{ position: 'absolute' }}
                                animate={{ opacity: 1, rotate: -45 }}
                            >
                                <Compass size={32} color="rgba(255,255,255,0.8)" />
                            </motion.div>
                        )}

                        <motion.div
                            animate={{ y: isSynced ? [-20, 0, -20] : 0 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ position: 'absolute', top: '-40px', opacity: isSynced ? 1 : 0.2 }}
                        >
                            <Target size={30} color="white" />
                        </motion.div>
                    </motion.div>
                </div>

                {!isChecking && !isSynced ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleInitialization}
                        className="glass-panel glow-border-red font-orbitron"
                        style={{
                            marginTop: '2rem',
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
                    <div className="flex-column" style={{ marginTop: '2rem', gap: '0.5rem' }}>
                        <div className="font-orbitron" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{t.checkTitle}</div>

                        <div className="flex-center" style={{ justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem' }}>{t.checkGps}</span>
                            <span className="font-orbitron" style={{ color: getStatusColor(gpsStatus) }}>
                                {gpsStatus === 'checking' ? t.checking : gpsStatus === 'success' ? 'OK' : gpsStatus === 'error' ? 'FAIL' : '-'}
                            </span>
                        </div>

                        <div className="flex-center" style={{ justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem' }}>{t.checkSensor}</span>
                            <span className="font-orbitron" style={{ color: getStatusColor(sensorStatus) }}>
                                {sensorStatus === 'checking' ? t.checking : sensorStatus === 'success' ? 'OK' : sensorStatus === 'error' ? 'FAIL' : '-'}
                            </span>
                        </div>
                    </div>
                )}

                {isSynced && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel guidance-card"
                >
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.8rem', marginBottom: '0.5rem' }}>
                        <Target size={18} color="var(--nebula-red)" />
                        <span className="font-orbitron text-nebula-red" style={{ fontSize: '0.8rem', letterSpacing: '0.1rem' }}>MISSION GUIDANCE</span>
                    </div>
                    <p className="text-white-dim" style={{ fontSize: '0.95rem', lineHeight: '1.5', textAlign: 'left' }}>
                        {t.detail}
                    </p>
                </motion.div>
            )}

            {isSynced && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glow-text-red font-orbitron"
                    style={{ marginTop: '2rem', letterSpacing: '0.3rem' }}
                >
                    {t.footer}
                </motion.div>
            )}
        </div>
    );
};

export default Step1_Docking;
