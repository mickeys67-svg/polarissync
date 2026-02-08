import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FullScreenLayoutProps {
    children: React.ReactNode;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children }) => {
    return (
        <main className="screen-container">
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
