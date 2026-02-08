import { useState, useEffect, useRef } from 'react';

export interface OrientationData {
    alpha: number;
    beta: number;
    gamma: number;
    displayRotation: number;
    isStable: boolean;
}

export const useDeviceOrientation = (smoothingFactor = 0.1) => {
    const [data, setData] = useState<OrientationData>({
        alpha: 0,
        beta: 0,
        gamma: 0,
        displayRotation: 0,
        isStable: false
    });
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error' | 'calibrating'>('idle');
    const [permissionNeeded, setPermissionNeeded] = useState(false);

    const lastRotation = useRef<number>(0);
    const sampleBuffer = useRef<number[]>([]);

    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setPermissionNeeded(true);
        }
    }, []);

    const startTracking = async () => {
        setStatus('checking');

        const handleOrientation = (e: DeviceOrientationEvent) => {
            const heading = (e as any).webkitCompassHeading || e.alpha || 0;

            // Smoothing logic (Low-pass filter)
            let rotateVal = heading;
            const diff = rotateVal - lastRotation.current;
            if (diff > 180) lastRotation.current += 360;
            if (diff < -180) lastRotation.current -= 360;

            const smoothed = lastRotation.current + (rotateVal - lastRotation.current) * smoothingFactor;
            lastRotation.current = smoothed;

            // Stability check
            sampleBuffer.current.push(heading);
            if (sampleBuffer.current.length > 30) sampleBuffer.current.shift();

            const isStable = sampleBuffer.current.length >= 30 && (() => {
                const mean = sampleBuffer.current.reduce((a, b) => a + b, 0) / 30;
                const variance = sampleBuffer.current.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 30;
                // Stricter variance threshold for better stabilization
                return variance < 8;
            })();

            setData({
                alpha: heading,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
                displayRotation: smoothed,
                isStable
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
