import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Target, Cpu } from 'lucide-react';

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
    };
}

const Step1_Docking: React.FC<Step1_Props> = ({ onComplete, title, slogan, t }) => {
    const [isSynced, setIsSynced] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsSynced(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ padding: '2rem', width: '100%' }}>
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
                className="glass-panel"
                style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}
            >
                <h1 className="glow-text-red" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{title}</h1>
                <p className="text-white-dim" style={{ marginBottom: '2rem' }}>
                    {slogan}
                </p>

                <div className="flex-center" style={{ position: 'relative', height: '200px', width: '100%' }}>
                    {/* Wireframe placeholder for now */}
                    <motion.div
                        animate={{ rotateZ: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        style={{ position: 'relative' }}
                    >
                        <Smartphone size={80} color="var(--nebula-red)" className="neon-svg" />
                        <motion.div
                            animate={{ y: [-20, 0, -20] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ position: 'absolute', top: '-40px', left: '0' }}
                        >
                            <Target size={30} color="white" />
                        </motion.div>
                    </motion.div>
                </div>

                <div className="flex-center" style={{ marginTop: '2rem', gap: '1rem' }}>
                    <div className="glass-panel flex-column flex-center" style={{ padding: '1rem', flex: 1 }}>
                        <Cpu size={24} color="var(--nebula-red)" />
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{t.system}</div>
                        <div className="font-orbitron" style={{ fontSize: '1rem' }}>{t.ready}</div>
                    </div>
                    <div className="glass-panel flex-column flex-center" style={{ padding: '1rem', flex: 1 }}>
                        <Smartphone size={24} color="var(--nebula-red)" />
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{t.sync}</div>
                        <div className="font-orbitron" style={{ fontSize: '1rem' }}>{isSynced ? t.done : t.wait}</div>
                    </div>
                </div>

                {isSynced && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className="glass-panel glow-border-red font-orbitron"
                        style={{
                            marginTop: '3rem',
                            width: '100%',
                            padding: '1.2rem',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontFamily: 'var(--font-orbitron)',
                            cursor: 'pointer',
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
