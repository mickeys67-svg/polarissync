import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const ExpertMode: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-inter pb-24">
            <header className="max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl font-orbitron font-bold text-purple-400 mb-2">EXPERT INTERFACE</h1>
                <p className="text-white/40 text-sm uppercase tracking-widest">Scientific Grade RA Sync Dashboard</p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-panel p-8 border-purple-500/20 bg-purple-500/5">
                    <h2 className="font-orbitron text-xl mb-6 text-purple-300">RA Correction Formula</h2>
                    <div className="bg-black/40 p-6 rounded-2xl mb-6 font-mono text-sm leading-relaxed">
                        <BlockMath math="\Delta \alpha = (\alpha_2 - \alpha_1) \sin(\phi) + \cos(\phi)\sin(\beta_2)" />
                    </div>
                    <p className="text-xs text-white/40 leading-loose">
                        Where <InlineMath math="\alpha" /> is the azimuth, <InlineMath math="\beta" /> is the altitude (pitch), and <InlineMath math="\phi" /> is the observer's latitude.
                        The Kalman Filter process noise <InlineMath math="Q" /> and measurement noise <InlineMath math="R" /> are dynamically tuned for high-frequency sampling.
                    </p>
                </section>

                <section className="glass-panel p-8 border-white/10">
                    <h2 className="font-orbitron text-xl mb-6">Real-time Matrix (Placeholder)</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest">Vector SENSE_{i}</span>
                                <span className="font-mono text-cyan-400">{(Math.random() * 100).toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 text-center border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="block text-2xl mb-2">📥</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Export CSV</span>
                </div>
                <div className="glass-panel p-6 text-center border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="block text-2xl mb-2">🔗</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Live Stream API</span>
                </div>
                <div className="glass-panel p-6 text-center border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="block text-2xl mb-2">⚙️</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Tuning Params</span>
                </div>
            </div>
        </div>
    );
};
