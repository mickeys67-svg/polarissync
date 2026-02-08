import React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC<{ message?: string }> = ({ message = "LOADING MISSION DATA..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="relative w-24 h-24 mb-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-r-2 border-cyan-400 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-b-2 border-l-2 border-white/20 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse" />
                </div>
            </div>
            <p className="font-orbitron text-[10px] text-cyan-400 tracking-[0.4em] animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Loading;
