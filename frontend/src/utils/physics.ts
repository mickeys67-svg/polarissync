/**
 * Kalman Filter Implementation for Sensor Smoothing
 * Q: Process Noise (how much we trust the prediction)
 * R: Measurement Noise (how much we trust the sensor)
 */
export class KalmanFilter {
    private Q: number;
    private R: number;
    private x: number;
    private P: number;
    private K: number;

    constructor(Q = 0.05, R = 2) {
        this.Q = Q;
        this.R = R;
        this.x = 0;
        this.P = 1;
        this.K = 0;
    }

    filter(measurement: number): number {
        // 1. Prediction
        this.P = this.P + this.Q;

        // 2. Kalman Gain
        this.K = this.P / (this.P + this.R);

        // 3. Update estimate
        this.x = this.x + this.K * (measurement - this.x);

        // 4. Update estimate error
        this.P = (1 - this.K) * this.P;

        return this.x;
    }
}

/**
 * Astronomical & Orientation Calculations
 */
export const physics = {
    // Degree to Radian conversion
    toRadians: (deg: number) => deg * (Math.PI / 180),
    // Radian to Degree conversion
    toDegrees: (rad: number) => rad * (180 / Math.PI),

    /**
     * Calculates RA Offset based on 2-point alignment (Initial vs Final)
     */
    calculateRAOffset: (initial: { alpha: number; beta: number }, final: { alpha: number; beta: number }, latitude: number) => {
        let deltaAlpha = final.alpha - initial.alpha;

        // Wrap around 360 boundary
        if (deltaAlpha > 180) deltaAlpha -= 360;
        else if (deltaAlpha < -180) deltaAlpha += 360;

        const latRad = physics.toRadians(latitude);
        const pitchCorrection = Math.sin(latRad);

        // Final Beta (Pitch/Altitude) correction
        const betaCorrection = Math.cos(latRad) * Math.sin(physics.toRadians(final.beta));

        // RA Offset logic: Horizontal shift weighted by latitude + spherical pitch correction
        const raOffsetDegrees = deltaAlpha * pitchCorrection + physics.toDegrees(betaCorrection);

        return {
            degrees: Number(raOffsetDegrees.toFixed(3)),
            minutes: Number((raOffsetDegrees * 4).toFixed(2)) // 1 degree = 4 minutes (approximate for RA)
        };
    },

    /**
     * Calculates Alignment Confidence Score (0-100)
     */
    calculateConfidence: (params: {
        rotation: number;
        stdDev: number;
        gpsAccuracy: number;
        isStable: boolean;
        sampleCount: number;
    }) => {
        // Weighted factors
        const weights = {
            rotation: 0.40,   // Goal completion (60 deg)
            stability: 0.25,  // Low variance/jitter
            integrity: 0.15,  // Sensor state readiness
            quality: 0.10,    // Sample density
            smoothness: 0.10  // Motion consistency
        };

        // 1. Rotation Progress (0-100)
        const rotationScore = Math.min((params.rotation / 60) * 100, 100);

        // 2. Stability Score (StdDev < 0.5 is ideal)
        const stabilityScore = Math.max(0, 100 - params.stdDev * 50);

        // 3. Sensor Integrity (GPS Accuracy < 30m, stable state)
        let integrityScore = 0;
        if (params.gpsAccuracy < 30) integrityScore += 50;
        if (params.isStable) integrityScore += 50;

        // 4. Data Quality (Aim for at least 300 samples for better math)
        const qualityScore = Math.min((params.sampleCount / 300) * 100, 100);

        // Simplification for v1: We combine them with weights
        const total = (
            rotationScore * weights.rotation +
            stabilityScore * weights.stability +
            integrityScore * weights.integrity +
            qualityScore * weights.quality +
            100 * weights.smoothness // Assume smoothness for now
        );

        return Math.min(Math.round(total), 100);
    }
};
