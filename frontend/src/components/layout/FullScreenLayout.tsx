import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import type { Language } from '../../translations';

interface FullScreenLayoutProps {
    children: React.ReactNode;
    onToggleLang?: () => void;
    currentLang?: Language;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children, onToggleLang, currentLang }) => {
    return (
        <main className="screen-container">
            {/* Global Header with Language Toggle */}
            <div className="absolute top-1 right-1 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleLang}
                    className="glass-panel p-05rem flex-center gap-05rem border-cyan hover-glow-cyan"
                    title="Change Language"
                >
                    <Globe size={16} color="var(--color-info)" />
                    <span className="font-orbitron text-07rem text-info uppercase">
                        {currentLang === 'ko' ? 'ENG' : 'KOR'}
                    </span>
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={window.location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        width: '100%',
                        minHeight: '100dvh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: '4rem 1.5rem 6rem 1.5rem',
                        boxSizing: 'border-box'
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
    );
};

export default FullScreenLayout;
