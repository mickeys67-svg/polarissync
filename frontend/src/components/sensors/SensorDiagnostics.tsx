import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useSensorData } from '../../hooks/useSensorData';
import { useMissionStore } from '../../store/missionStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SensorDiagnosticsProps {
    onComplete: () => void;
}

const SensorDiagnostics: React.FC<SensorDiagnosticsProps> = ({ onComplete }) => {
    const { sensorData, stdDev, isStable } = useSensorData();
    const [canProceed, setCanProceed] = React.useState(false);

    React.useEffect(() => {
        // Failsafe: Always allow proceeding after 5 seconds
        const timer = setTimeout(() => {
            setCanProceed(true);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const { startMission } = useMissionStore();
    const [isInitializing, setIsInitializing] = React.useState(false);

    const handleProceed = async () => {
        setIsInitializing(true);
        try {
            await startMission(sensorData);
            onComplete();
        } catch (error) {
            console.error('Mission start failed:', error);
            onComplete(); // Still proceed even if sync fails (offline mode)
        } finally {
            setIsInitializing(false);
        }
    };

    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    const isReady = (isStable || canProceed || isDev) && !isInitializing;

    const data = {
        labels: Array.from({ length: 20 }, (_, i) => i.toString()),
        datasets: [
            {
                label: 'Alpha (Azimuth)',
                data: Array.from({ length: 20 }, () => sensorData.alpha + (Math.random() - 0.5)),
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.5)',
                tension: 0.4,
                pointRadius: 0,
            },
            {
                label: 'Beta (Pitch)',
                data: Array.from({ length: 20 }, () => sensorData.beta + (Math.random() - 0.5)),
                borderColor: '#f472b6',
                backgroundColor: 'rgba(244, 114, 182, 0.5)',
                tension: 0.4,
                pointRadius: 0,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } }
            },
            x: {
                display: false,
            }
        },
    };

    return (
        <div className="max-w-md mx-auto">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-orbitron font-bold text-white">TELEMERY</h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">REAL-TIME SENSOR FUSION</p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[10px] font-bold ${isStable ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'}`}>
                    {isStable ? '✦ SIGNAL STABLE' : '⚠ NOISE DETECTED'}
                </div>
            </header>

            <div className="glass-panel p-6 mb-4 bg-white/5 border-white/5">
                <div className="h-40 mb-6">
                    <Line data={data} options={options} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase tracking-tighter mb-1">AZIMUTH (α)</span>
                        <span className="text-xl font-orbitron font-bold text-cyan-400">{sensorData.alpha.toFixed(1)}°</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase tracking-tighter mb-1">PITCH (β)</span>
                        <span className="text-xl font-orbitron font-bold text-pink-400">{sensorData.beta.toFixed(1)}°</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase tracking-tighter mb-1">STABILITY / σ</span>
                        <span className="text-xl font-orbitron font-bold text-white">{stdDev.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="text-[10px] text-white/20 italic leading-relaxed text-center px-4 mb-8">
                "Kalman filter is active. Wait for standard deviation to drop below 5.0 for optimal alignment."
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                disabled={!isReady}
                onClick={handleProceed}
                className={`w-full py-5 rounded-2xl font-orbitron font-bold uppercase tracking-widest transition-all btn-step1 ${isReady ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-white/20 opacity-40 cursor-not-allowed'}`}
            >
                {isInitializing ? 'INITIALIZING MISSION...' : (isReady ? 'PROCEED TO MISSION' : 'STABILIZING SENSORS...')}
            </motion.button>
        </div>
    );
};

export default SensorDiagnostics;
