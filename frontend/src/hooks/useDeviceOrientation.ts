import { useState, useEffect, useRef } from 'react';
import { KalmanFilter } from '../utils/physics';

export interface OrientationData {
    alpha: number;
    beta: number;
    gamma: number;
    displayRotation: number;
    isStable: boolean;
    stdDev: number; // Exporting standard deviation for confidence calculation
}

export const useDeviceOrientation = (smoothingFactor = 0.1) => {
    const [data, setData] = useState<OrientationData>({
        alpha: 0,
        beta: 0,
        gamma: 0,
        displayRotation: 0,
        isStable: false,
        stdDev: 0
    });
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error' | 'calibrating'>('idle');
    const [permissionNeeded, setPermissionNeeded] = useState(false);

    const lastRotation = useRef<number>(0);
    const sampleBuffer = useRef<number[]>([]);

    // Initialize Kalman Filters
    // Q=0.01, R=0.1 for high responsiveness with good stability
    const filterAlpha = useRef(new KalmanFilter(0.01, 0.1));
    const filterBeta = useRef(new KalmanFilter(0.01, 0.1));
    const filterGamma = useRef(new KalmanFilter(0.01, 0.1));

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setPermissionNeeded(true);
        }
    }, []);

    const startTracking = async () => {
        setStatus('checking');

        const handleOrientation = (e: DeviceOrientationEvent) => {
            const rawAlpha = (e as any).webkitCompassHeading || e.alpha || 0;
            const rawBeta = e.beta || 0;
            const rawGamma = e.gamma || 0;

            // Apply Kalman Filtering to all axes
            const alpha = filterAlpha.current.filter(rawAlpha);
            const beta = filterBeta.current.filter(rawBeta);
            const gamma = filterGamma.current.filter(rawGamma);

            // Display rotation smoothing logic (Low-pass filter for UI smoothness)
            let rotateVal = alpha;
            const diff = rotateVal - lastRotation.current;
            if (diff > 180) lastRotation.current += 360;
            if (diff < -180) lastRotation.current -= 360;

            const smoothed = lastRotation.current + (rotateVal - lastRotation.current) * smoothingFactor;
            lastRotation.current = smoothed;

            // Stability check (using raw alpha for variance calculation)
            sampleBuffer.current.push(rawAlpha);
            if (sampleBuffer.current.length > 30) sampleBuffer.current.shift();

            const stats = (() => {
                if (sampleBuffer.current.length < 30) return { isStable: false, stdDev: 0 };
                const mean = sampleBuffer.current.reduce((a, b) => a + b, 0) / 30;
                const variance = sampleBuffer.current.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 30;
                const stdDev = Math.sqrt(variance);
                return { isStable: variance < 8, stdDev };
            })();

            setData({
                alpha,
                beta,
                gamma,
                displayRotation: smoothed,
                isStable: stats.isStable,
                stdDev: stats.stdDev
            });
            setStatus('success');
        };

        try {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                    window.addEventListener('deviceorientation', handleOrientation, true);
                } else {
                    setStatus('error');
                }
            } else {
                window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                window.addEventListener('deviceorientation', handleOrientation, true);
            }
        } catch (err) {
            console.error("Orientation error:", err);
            setStatus('error');
        }
    };

    return { data, status, permissionNeeded, startTracking };
};
