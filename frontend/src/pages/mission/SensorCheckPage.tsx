import React from 'react';
import { useNavigate } from 'react-router-dom';
import SensorDiagnostics from '../../components/sensors/SensorDiagnostics';

const SensorCheckPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-orbitron font-bold text-cyan-400 mb-2">SENSOR AUDIT</h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">Verifying Telemetry Accuracy</p>
                </header>

                <SensorDiagnostics onComplete={() => navigate('/mission')} />

                <div className="text-center mt-6">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">
                        Hold device steady for audit
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SensorCheckPage;
