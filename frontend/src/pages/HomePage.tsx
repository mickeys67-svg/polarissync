import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Focus, GraduationCap, Users, User } from 'lucide-react';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const modes = [
        {
            id: 'beginner',
            title: '초보자 모드 (Beginner)',
            description: '처음 사용하는 분들을 위한 간단한 가이드 중심 모드',
            icon: <Sparkles className="text-green-400" size={48} />,
            color: 'border-green-500/30',
            hover: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
            features: ['큰 버튼과 직관적 디자인', '단계별 음성/텍스트 가이드', '자동 설정 최적화']
        },
        {
            id: 'enthusiast',
            title: '애호가 모드 (Enthusiast)',
            description: '상세한 센서 데이터와 그래프를 원하는 중급자용 모드',
            icon: <Focus className="text-blue-400" size={48} />,
            color: 'border-blue-500/30',
            hover: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
            features: ['실시간 센서 텔레메트리 그래프', '상세 정렬 분석 리포트', '고급 보정 팁 제공']
        },
        {
            id: 'expert',
            title: '전문가 모드 (Expert)',
            description: '학술적 정밀도와 원시 데이터가 필요한 전천 전문가용',
            icon: <GraduationCap className="text-purple-400" size={48} />,
            color: 'border-purple-500/30',
            hover: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
            features: ['실시간 RA/Dec 오프셋 수치', '원시 센서 데이터 API 접근', '데이터 내보내기 (CSV/JSON)']
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="text-center mb-16 pt-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-orbitron font-bold mb-4 tracking-tighter"
                    >
                        Polaris<span className="text-cyan-400">Sync</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/50 font-light"
                    >
                        망원경 정렬의 새로운 패러다임
                    </motion.p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {modes.map((mode, index) => (
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(`/${mode.id}`)}
                            className={`glass-panel p-8 cursor-pointer transition-all duration-300 ${mode.color} ${mode.hover} flex flex-col items-center text-center`}
                        >
                            <div className="mb-6 bg-white/5 p-6 rounded-2xl">
                                {mode.icon}
                            </div>
                            <h2 className="text-2xl font-orbitron font-bold mb-3">{mode.title}</h2>
                            <p className="text-white/60 mb-6 text-sm leading-relaxed">
                                {mode.description}
                            </p>
                            <ul className="text-left space-y-3 mb-8 w-full">
                                {mode.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="text-xs text-white/40 flex items-start gap-2">
                                        <span className="text-cyan-400 mt-1">✦</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto w-full">
                                <button className="w-full py-4 glass-panel border-white/10 hover:bg-white/5 font-orbitron text-sm">
                                    LAUNCH MISSION
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Global Navigation Stubs */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel p-2 flex items-center gap-4 border-white/10">
                    <button
                        className="p-4 hover:bg-white/5 rounded-xl transition-colors"
                        aria-label="Community"
                        title="Community"
                    >
                        <Users size={24} className="text-white/60" />
                    </button>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <button
                        className="p-4 hover:bg-white/5 rounded-xl transition-colors"
                        aria-label="Profile"
                        title="Profile"
                    >
                        <User size={24} className="text-white/60" />
                    </button>
                </div>
            </div>
        </div>
    );
};
