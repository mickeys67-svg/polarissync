// 파일: src/utils/confidenceCalculator.ts
interface SensorReading {
    timestamp: number;
    alpha: number;
    beta: number;
    gamma: number;
}

export class ConfidenceCalculator {
    /**
     * 전체 신뢰도 계산
     */
    static calculate(
        currentRotation: number,
        readings: SensorReading[],
        targetRotation: number = 60
    ): number {
        const angleScore = this.calculateAngleScore(currentRotation, targetRotation);
        const stability = this.calculateStability(readings);
        const integrity = this.calculateIntegrity(readings);
        const quality = this.calculateQuality(readings);
        const smoothness = this.calculateSmoothness(readings);

        const confidence =
            angleScore * 0.40 +
            stability * 0.25 +
            integrity * 0.15 +
            quality * 0.10 +
            smoothness * 0.10;

        return Math.round(Math.max(0, Math.min(100, confidence)));
    }

    /**
     * 회전 각도 점수 (0-100%)
     */
    private static calculateAngleScore(current: number, target: number): number {
        return Math.min((current / target) * 100, 100);
    }

    /**
     * 센서 안정도 (표준편차 기반)
     */
    private static calculateStability(readings: SensorReading[]): number {
        if (readings.length < 10) return 0;

        const recent = readings.slice(-10);
        const alphaValues = recent.map(r => r.alpha);

        const mean = alphaValues.reduce((a, b) => a + b) / alphaValues.length;
        const variance =
            alphaValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
            alphaValues.length;
        const stdDev = Math.sqrt(variance);

        return Math.max(0, 100 - stdDev * 20);
    }

    /**
     * 센서 무결성
     */
    private static calculateIntegrity(readings: SensorReading[]): number {
        if (readings.length === 0) return 0;

        let score = 0;
        const first = readings[0];
        const last = readings[readings.length - 1];

        const alphaDiff = Math.abs(last.alpha - first.alpha);
        if (alphaDiff > 5) score += 50;

        const betaDiff = Math.abs(last.beta - first.beta);
        if (betaDiff < 10) score += 50;

        return score;
    }

    /**
     * 데이터 품질
     */
    private static calculateQuality(readings: SensorReading[]): number {
        return Math.min((readings.length / 600) * 100, 100);
    }

    /**
     * 회전 부드러움
     */
    private static calculateSmoothness(readings: SensorReading[]): number {
        if (readings.length < 5) return 0;

        const speeds: number[] = [];
        for (let i = 1; i < readings.length; i++) {
            const current = readings[i];
            const previous = readings[i - 1];
            const timeDiff = (current.timestamp - previous.timestamp) / 1000;
            const angleDiff = Math.abs(current.alpha - previous.alpha);
            const speed = angleDiff / timeDiff;
            speeds.push(speed);
        }

        const avgSpeed = speeds.reduce((a, b) => a + b) / speeds.length;
        const speedVariance =
            speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) /
            speeds.length;

        return Math.max(0, 100 - Math.sqrt(speedVariance) * 50);
    }
}
