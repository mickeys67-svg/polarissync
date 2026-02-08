import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, History, RotateCcw } from 'lucide-react';

interface MissionSuccessProps {
    onRestart: () => void;
    t: {
        success: string;
        subtitle: string;
        stabilityScore: string;
        raOffset: string;
        accuracyMin: string;
        totalTime: string;
        restart: string;
        save: string;
        tips: string[];
    }
}

const MissionSuccess: React.FC<MissionSuccessProps> = ({ onRestart, t }) => {
    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center font-inter text-center">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="bg-cyan-500/20 p-8 rounded-full border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                        <CheckCircle2 size={72} className="text-cyan-400" />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-orbitron font-bold text-white mb-2">{t.success}</h1>
                <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-12">{t.subtitle}</p>

                <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="glass-panel p-6 border-white/5 bg-white/5">
                        <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-2 font-bold">{t.raOffset}</span>
                        <span className="text-3xl font-orbitron font-bold text-cyan-400">+0.12°</span>
                    </div>
                    <div className="glass-panel p-6 border-white/5 bg-white/5">
                        <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-2 font-bold">{t.accuracyMin}</span>
                        <span className="text-3xl font-orbitron font-bold text-white">0.48′</span>
                    </div>
                </div>

                <div className="space-y-4 mb-16">
                    <button className="w-full py-5 bg-white text-black rounded-2xl font-orbitron font-bold flex items-center justify-center gap-3">
                        <History size={20} /> {t.save}
                    </button>
                    <button
                        onClick={onRestart}
                        className="w-full py-5 glass-panel border-white/10 hover:bg-white/5 font-orbitron font-bold text-white/60 flex items-center justify-center gap-3"
                    >
                        <RotateCcw size={20} /> {t.restart}
                    </button>
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl text-left">
                    <h3 className="text-xs font-orbitron font-bold text-cyan-400 mb-4 uppercase tracking-widest tracking-tighter">COSMIC INSIGHTS</h3>
                    <ul className="space-y-3">
                        {t.tips.map((tip, i) => (
                            <li key={i} className="text-[11px] text-white/60 flex items-start gap-3 leading-relaxed">
                                <span className="text-cyan-400">✦</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MissionSuccess;
