// 파일: src/utils/raAxisCalculator.ts
export class RAAxisCalculator {
    /**
     * RA축(적경축) 오프셋 계산
     */
    static calculate(
        initialAlpha: number,
        finalAlpha: number,
        latitude: number,
        finalBeta: number = 0
    ): number {
        // 방위각 변화
        let deltaAlpha = finalAlpha - initialAlpha;

        // 360도 경계 처리
        if (deltaAlpha > 180) deltaAlpha -= 360;
        if (deltaAlpha < -180) deltaAlpha += 360;

        // 위도를 라디안으로 변환
        const latRad = (latitude * Math.PI) / 180;

        // RA축 오프셋 계산
        const raOffset =
            deltaAlpha * Math.sin(latRad) + finalBeta * Math.cos(latRad);

        return parseFloat(raOffset.toFixed(2));
    }

    /**
     * RA 오프셋을 분(minutes) 단위로 변환
     */
    static toMinutes(raOffsetDegrees: number): number {
        return parseFloat((raOffsetDegrees * 4).toFixed(2));
    }

    /**
     * 오차 범위 계산
     */
    static calculateErrorBounds(
        sensorStability: number,
        gpsAccuracy: number
    ): { lower: number; upper: number } {
        const sensorError = sensorStability * 0.5;
        const gpsError = gpsAccuracy * 0.0001;

        const totalError = Math.sqrt(sensorError ** 2 + gpsError ** 2);

        return {
            lower: parseFloat((-totalError).toFixed(2)),
            upper: parseFloat(totalError.toFixed(2))
        };
    }
}
