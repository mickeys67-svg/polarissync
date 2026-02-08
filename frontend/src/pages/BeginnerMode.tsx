import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightCircle, Sparkles } from 'lucide-react';

export const BeginnerMode: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center font-inter">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-sm"
            >
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-500/20 p-8 rounded-full border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <Sparkles size={64} className="text-green-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">반가워요! 🌟</h1>
                <p className="text-white/60 mb-10 leading-relaxed font-light">
                    망원경 정렬을 처음 해보시나요? <br />
                    걱정 마세요. 제가 아주 쉽게 알려드릴게요. <br />
                    준비가 되셨다면 아래 버튼을 눌러주세요!
                </p>

                <button className="w-full py-6 bg-green-500 text-black font-bold text-xl rounded-3xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3">
                    시작할까요? <ArrowRightCircle size={28} />
                </button>

                <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4 aspect-square flex flex-col items-center justify-center bg-white/5">
                        <span className="text-3xl mb-2">🧭</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">센서 확인</span>
                    </div>
                    <div className="glass-panel p-4 aspect-square flex flex-col items-center justify-center bg-white/5">
                        <span className="text-3xl mb-2">📖</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">사용법 보기</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
