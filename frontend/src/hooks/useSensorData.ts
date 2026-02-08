import { useState, useEffect, useCallback, useRef } from 'react';

interface SensorData {
    alpha: number;
    beta: number;
    gamma: number;
    timestamp: number;
}

interface UseSensorDataReturn {
    sensorData: SensorData;
    isSupported: boolean;
    hasPermission: boolean;
    isStable: boolean;
    stdDev: number;
    requestPermission: () => Promise<boolean>;
}

export const useSensorData = (): UseSensorDataReturn => {
    const [sensorData, setSensorData] = useState<SensorData>({
        alpha: 0,
        beta: 0,
        gamma: 0,
        timestamp: Date.now()
    });

    const [isSupported, setIsSupported] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [isStable, setIsStable] = useState(false);
    const [stdDev, setStdDev] = useState(0);
    const sampleBuffer = useRef<number[]>([]);

    useEffect(() => {
        setIsSupported(typeof DeviceOrientationEvent !== 'undefined');
    }, []);

    useEffect(() => {
        // ✅ 개발 환경: 시뮬레이션 데이터 사용
        const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
        if (isDev && !hasPermission) {
            console.log('📊 [DEV MODE] 시뮬레이션 센서 데이터 사용');

            let angle = 0;
            const interval = setInterval(() => {
                angle = (angle + 0.5) % 360;  // 0.5도씩 증가

                setSensorData({
                    alpha: angle,
                    beta: 45 + Math.sin(angle * Math.PI / 180) * 10,
                    gamma: Math.cos(angle * Math.PI / 180) * 10,
                    timestamp: Date.now()
                });
            }, 100);  // 100ms마다 업데이트

            return () => clearInterval(interval);
        }

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const rawAlpha = (event as any).webkitCompassHeading || event.alpha || 0;
            const beta = event.beta || 0;
            const gamma = event.gamma || 0;

            if (event.alpha === null && !isDev) {
                console.error('❌ 센서를 지원하지 않는 기기');
                return;
            }

            // Stability check
            sampleBuffer.current.push(rawAlpha);
            if (sampleBuffer.current.length > 20) sampleBuffer.current.shift();

            if (sampleBuffer.current.length >= 20) {
                const mean = sampleBuffer.current.reduce((a: number, b: number) => a + b, 0) / 20;
                const variance = sampleBuffer.current.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / 20;
                const currentStdDev = Math.sqrt(variance);
                setStdDev(currentStdDev);
                setIsStable(variance < 5.0);
            }

            setSensorData({
                alpha: rawAlpha,
                beta,
                gamma,
                timestamp: Date.now()
            });
        };

        const orientationEvent = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
        window.addEventListener(orientationEvent, handleOrientation as any, true);

        return () => {
            window.removeEventListener(orientationEvent, handleOrientation as any, true);
        };
    }, [hasPermission]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        try {
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof (DeviceOrientationEvent as any).requestPermission === 'function'
            ) {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                setHasPermission(permission === 'granted');
                return permission === 'granted';
            } else {
                setHasPermission(true);
                return true;
            }
        } catch (error) {
            console.error('권한 요청 실패:', error);
            return false;
        }
    }, []);

    return {
        sensorData,
        isSupported,
        hasPermission,
        isStable,
        stdDev,
        requestPermission
    };
};
