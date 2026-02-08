import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Camera, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import type { Translations } from '../translations';

interface PermissionGatewayProps {
    onComplete: () => void;
    t: Translations['permissions'];
}

const PermissionGateway: React.FC<PermissionGatewayProps> = ({ onComplete, t }) => {
    const [permissions, setPermissions] = useState({
        gps: false,
        sensor: false,
        camera: false
    });

    const [loading, setLoading] = useState({
        gps: false,
        sensor: false,
        camera: false
    });

    const requestGPS = async () => {
        setLoading(prev => ({ ...prev, gps: true }));
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            if (pos) setPermissions(prev => ({ ...prev, gps: true }));
        } catch (err) {
            console.error("GPS access denied", err);
        } finally {
            setLoading(prev => ({ ...prev, gps: false }));
        }
    };

    const requestSensor = async () => {
        setLoading(prev => ({ ...prev, sensor: true }));
        try {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissions(prev => ({ ...prev, sensor: true }));
                }
            } else {
                // Non-iOS or older browsers
                setPermissions(prev => ({ ...prev, sensor: true }));
            }
        } catch (err) {
            console.error("Sensor access denied", err);
        } finally {
            setLoading(prev => ({ ...prev, sensor: false }));
        }
    };

    const requestCamera = async () => {
        setLoading(prev => ({ ...prev, camera: true }));
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (stream) {
                setPermissions(prev => ({ ...prev, camera: true }));
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (err) {
            console.error("Camera access denied", err);
        } finally {
            setLoading(prev => ({ ...prev, camera: false }));
        }
    };

    const allRequired = permissions.gps && permissions.sensor;

    return (
        <div className="screen-container flex-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel responsive-padding step-container"
            >
                <div className="flex-center gap-05rem margin-bottom-1">
                    <AlertTriangle color="var(--color-warning)" size={20} />
                    <h2 className="font-orbitron text-warning text-1-2rem">{t.title}</h2>
                </div>

                <div className="permission-list margin-top-2">
                    {/* GPS */}
                    <div className="check-row margin-bottom-1">
                        <div className="flex-center gap-1rem">
                            <MapPin size={24} color={permissions.gps ? "var(--color-success)" : "white"} />
                            <div className="text-left">
                                <p className="font-bold">{t.gpsTitle}</p>
                                <p className="text-07rem text-white-dim">{t.gpsDesc}</p>
                            </div>
                        </div>
                        <button
                            className={`glass-panel p-05rem ${permissions.gps ? 'bg-success' : ''}`}
                            onClick={requestGPS}
                            disabled={permissions.gps || loading.gps}
                        >
                            {permissions.gps ? <Check size={18} /> : (loading.gps ? "..." : t.allow)}
                        </button>
                    </div>

                    {/* Sensor */}
                    <div className="check-row margin-bottom-1">
                        <div className="flex-center gap-1rem">
                            <Compass size={24} color={permissions.sensor ? "var(--color-success)" : "white"} />
                            <div className="text-left">
                                <p className="font-bold">{t.sensorTitle}</p>
                                <p className="text-07rem text-white-dim">{t.sensorDesc}</p>
                            </div>
                        </div>
                        <button
                            className={`glass-panel p-05rem ${permissions.sensor ? 'bg-success' : ''}`}
                            onClick={requestSensor}
                            disabled={permissions.sensor || loading.sensor}
                        >
                            {permissions.sensor ? <Check size={18} /> : (loading.sensor ? "..." : t.allow)}
                        </button>
                    </div>

                    {/* Camera */}
                    <div className="check-row margin-bottom-1">
                        <div className="flex-center gap-1rem">
                            <Camera size={24} color={permissions.camera ? "var(--color-success)" : "white"} />
                            <div className="text-left">
                                <p className="font-bold">{t.cameraTitle}</p>
                                <p className="text-07rem text-white-dim">{t.cameraDesc}</p>
                            </div>
                        </div>
                        <button
                            className="glass-panel p-05rem"
                            onClick={requestCamera}
                            disabled={permissions.camera || loading.camera}
                        >
                            {permissions.camera ? <Check size={18} /> : t.skip}
                        </button>
                    </div>
                </div>

                {allRequired && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="margin-top-2"
                    >
                        <p className="text-success text-085rem margin-bottom-1">{t.allAllowed}</p>
                        <button
                            className="btn-step1 font-orbitron bg-success"
                            onClick={onComplete}
                        >
                            START MISSION
                        </button>
                    </motion.div>
                )}

                {!allRequired && (
                    <div className="margin-top-2 flex-center gap-1rem">
                        <HelpCircle size={16} color="var(--starlight-dim)" />
                        <span className="text-07rem text-white-dim">{t.help}</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PermissionGateway;
