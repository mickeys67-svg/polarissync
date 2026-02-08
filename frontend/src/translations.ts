export type Language = 'en' | 'ko';

export interface Translations {
    title: string;
    slogan: string;
    step1: {
        status: string;
        system: string;
        ready: string;
        sync: string;
        done: string;
        wait: string;
        button: string;
        footer: string;
        detail: string;
        checkTitle: string;
        checkGps: string;
        checkSensor: string;
        btnCheck: string;
        checking: string;
        rawData: string;
        alpha: string;
        beta: string;
        gamma: string;
        precision: string;
        latLng: string;
        secureWarning: string;
        insecureMsg: string;
        activeEvent: string;
        btnPermission: string;
        calcMode: string;
        calibrating: string;
        stable: string;
        jittery: string;
        btnSetNorth: string;
        manualCalibration: string;
    };
    step2: {
        title: string;
        subtitle: string;
        confidence: string;
        instruction: string;
        button: string;
        detail: string;
        direction: string;
        lockOrientation: string;
        lockButton: string;
    };
    step3: {
        title: string;
        subtitle: string;
        successTitle: string;
        successSubtitle: string;
        instruction: string;
        instructionSuccess: string;
        detail: string;
    };
    step4: {
        title: string;
        subtitle: string;
        coachingTuning: string;
        coachingAligned: string;
        subtext: string;
        button: string;
        detail: string;
        altitude: string;
        azimuth: string;
        up: string;
        down: string;
        left: string;
        right: string;
    };
    final: {
        success: string;
        message: string;
        button: string;
        saveResult: string;
        restart: string;
        statsTitle: string;
        offsetResult: string;
        stabilityScore: string;
        timeTaken: string;
        tipTitle: string;
        tipContent: string;
    };
    error: {
        title: string;
        analysisTitle: string;
        causeAzimuth: string;
        causePitch: string;
        causeNoise: string;
        solutionTitle: string;
        solutionLevel: string;
        solutionMetal: string;
        solutionSlow: string;
        solutionOutdoor: string;
        retry: string;
        reset: string;
    };
    permissions: {
        title: string;
        gpsTitle: string;
        gpsDesc: string;
        sensorTitle: string;
        sensorDesc: string;
        cameraTitle: string;
        cameraDesc: string;
        allow: string;
        allowed: string;
        skip: string;
        allAllowed: string;
        help: string;
    };
    dashboard: {
        title: string;
        azimuth: string;
        pitch: string;
        roll: string;
        changeRate: string;
        normalRange: string;
        stability: string;
        initializing: string;
        stable: string;
        unstable: string;
        veryUnstable: string;
        error: string;
        feedbackFast: string;
        feedbackStable: string;
        feedbackIncreasing: string;
        feedbackRemaining: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        title: "PolarisSync",
        slogan: "Find Polaris. Observe with confidence",
        step1: {
            status: "Initializing Hubble-class precision...",
            system: "SYSTEM",
            ready: "READY",
            sync: "SYNC",
            done: "DONE",
            wait: "WAIT",
            button: "ENGAGE MISSION",
            footer: "SYSTEM SYNCHRONIZED",
            detail: "Attach your smartphone to the telescope eyepiece. Ensure the camera is centered and the aurora pulse is stable.",
            checkTitle: "SYSTEM PRE-FLIGHT CHECK",
            checkGps: "GPS COORDINATES",
            checkSensor: "ORIENTATION SENSORS",
            btnCheck: "INITIALIZE SYSTEM",
            checking: "SCANNING...",
            rawData: "RAW SENSOR DATA",
            alpha: "AZIMUTH (α)",
            beta: "PITCH (β)",
            gamma: "ROLL (γ)",
            precision: "GPS PRECISION",
            latLng: "LAT / LNG",
            secureWarning: "INSECURE CONTEXT DETECTED",
            insecureMsg: "Sensors require HTTPS to function. Please check your connection.",
            activeEvent: "DATA RESOURCE",
            btnPermission: "GRANT SENSOR PERMISSION",
            calcMode: "ALIGNMENT LOGIC",
            calibrating: "CALIBRATING",
            stable: "STABLE",
            jittery: "JITTERY",
            btnSetNorth: "CALIBRATE NORTH",
            manualCalibration: "MANUAL CALIBRATION"
        },
        step2: {
            title: "ORBIT DANCE",
            subtitle: "Calibrating RA axis by physical rotation...",
            confidence: "ALIGNMENT CONFIDENCE",
            instruction: "SWING THE TELESCOPE SLOWLY (60°)",
            button: "LOCK ORBIT",
            detail: "Physically rotate the telescope's Right Ascension (RA) axis by 60 degrees. This allows the AI to synchronize your physical position with the celestial map.",
            direction: "ROTATE RIGHT (CLOCKWISE)",
            lockOrientation: "STABILITY LOCK",
            lockButton: "ACTIVATE PORTRAIT LOCK"
        },
        step3: {
            title: "EVENT HORIZON",
            subtitle: "Locating Polaris Precise Center...",
            successTitle: "LOCK ACQUIRED",
            successSubtitle: "GRAVITY WELL CAPTURED",
            instruction: "MOVE THE PROBE TO THE SINGULARITY",
            instructionSuccess: "TRANSITIONING TO FINAL ALIGNMENT",
            detail: "Locate Polaris. Use the Dec and RA manual controls to move the singularity probe into the glowing center of the gravity lens."
        },
        step4: {
            title: "ALIGNMENT PULSE",
            subtitle: "The final adjustment to the cosmic center.",
            coachingTuning: "“Approaching the heart of the universe”",
            coachingAligned: "“Arrived at the cosmic center”",
            subtext: "Adjust the screws slightly to stabilize the pulse.",
            button: "COMPLETE MISSION",
            detail: "Fine-tune the Altitude and Azimuth screws. Move Polaris into the 0.7° offset circle (True North Celestial Pole). Look for the intersection flare.",
            altitude: "ALTITUDE (VERTICAL)",
            azimuth: "AZIMUTH (HORIZONTAL)",
            up: "UP",
            down: "DOWN",
            left: "LEFT",
            right: "RIGHT"
        },
        final: {
            success: "CLEAR SKIES!",
            message: "YOUR TELESCOPE IS NOW PART OF THE UNIVERSE",
            button: "RESTART MISSION",
            saveResult: "SAVE RESULT",
            restart: "RE-ALIGN",
            statsTitle: "MISSION LOG",
            offsetResult: "RA AXIS OFFSET",
            stabilityScore: "SENSOR STABILITY",
            timeTaken: "ALIGNMENT TIME",
            tipTitle: "COSMIC TIP",
            tipContent: "Re-alignment is recommended every 30 minutes to maintain precision."
        },
        error: {
            title: "ALIGNMENT FAILED",
            analysisTitle: "DIAGNOSTIC ANALYSIS",
            causeAzimuth: "Irregular Azimuth (α) delta",
            causePitch: "Pitch (β) exceeded ±10° range",
            causeNoise: "High signal noise detected",
            solutionTitle: "HOW TO STABILIZE",
            solutionLevel: "Ensure the telescope is level (Pitch near 0°)",
            solutionMetal: "Avoid metal objects (Compass interference)",
            solutionSlow: "Rotate slower (Target 1.0°/s)",
            solutionOutdoor: "Move outdoors for better GPS lock",
            retry: "RETRY",
            reset: "INITIALIZE"
        },
        permissions: {
            title: "REQUIRED CRITICAL ACCESS",
            gpsTitle: "GPS POSITIONING",
            gpsDesc: "Access location to sync with celestial vault",
            sensorTitle: "GYRO & COMPASS",
            sensorDesc: "Detect physical telescope rotation",
            cameraTitle: "CAMERA ACCESS (OPTIONAL)",
            cameraDesc: "For visual star-guide overlay",
            allow: "GRANT ACCESS",
            allowed: "AUTHORIZED",
            skip: "SKIP",
            allAllowed: "ALL SYSTEMS AUTHORIZED",
            help: "HELP"
        },
        dashboard: {
            title: "SENSOR TELEMETRY",
            azimuth: "AZIMUTH (α) - HORIZONTAL",
            pitch: "PITCH (β) - TILT",
            roll: "ROLL (γ) - LEVEL",
            changeRate: "SCAN RATE",
            normalRange: "NORMAL: ±5° RANGE",
            stability: "SIGNAL CLARITY",
            initializing: "INITIALIZING",
            stable: "STABLE",
            unstable: "UNSTABLE",
            veryUnstable: "CRITICAL JITTER",
            error: "SENSOR LOST",
            feedbackFast: "REDUCE SWING SPEED (TOO FAST)",
            feedbackStable: "SIGNAL STABILIZED",
            feedbackIncreasing: "CONFIDENCE INCREASING",
            feedbackRemaining: "REMAINING SCAN"
        }
    },
    ko: {
        title: "PolarisSync",
        slogan: "Find Polaris. Observe with confidence",
        step1: {
            status: "허블 망원경급 정밀도 초기화 중...",
            system: "시스템",
            ready: "준비 완료",
            sync: "동기화",
            done: "완료",
            wait: "대기 중",
            button: "미션 시작",
            footer: "시스템 동기화 완료",
            detail: "스마트폰을 망원경 접안렌즈에 장착하세요. 카메라가 중앙에 위치하고 오로라 펄스가 안정적인지 확인하세요.",
            checkTitle: "시스템 사전 점검",
            checkGps: "GPS 위치 정보",
            checkSensor: "방향 및 동작 센서",
            btnCheck: "시스템 초기화 및 권한 승인",
            checking: "점검 중...",
            rawData: "로우 센서 데이터",
            alpha: "방위각 (α)",
            beta: "피치 (β)",
            gamma: "롤 (γ)",
            precision: "GPS 정밀도",
            latLng: "위도 / 경도",
            secureWarning: "보안 연결(HTTPS) 아님",
            insecureMsg: "센서 데이터는 HTTPS 환경에서만 작동합니다. 연결을 확인해주세요.",
            activeEvent: "데이터 소스",
            btnPermission: "센서 권한 승인하기",
            calcMode: "회전 보정 로직",
            calibrating: "캘리브레이션 중",
            stable: "안정됨",
            jittery: "불안정함",
            btnSetNorth: "현재 방향을 북쪽으로 설정",
            manualCalibration: "수동 캘리브레이션"
        },
        step2: {
            title: "적경축 스윙 정렬 (Orbit Dance)",
            subtitle: "망원경의 적경(RA) 축을 물리적으로 회전하여 좌표를 동기화합니다.",
            confidence: "정렬 신뢰도",
            instruction: "망원경을 60도 가량 천천히 회전시켜 주세요",
            button: "궤도 고정",
            detail: "망원경의 적경(RA) 축을 시계 방향으로 60도 가량 천천히 회전시키세요. 실제 회전 각도가 감지되어야 정렬 점수가 상승하며 미션이 진행됩니다.",
            direction: "오른쪽으로 회전 (시계 방향)",
            lockOrientation: "안정화 필요",
            lockButton: "세로 모드 고정 (시작)"
        },
        step3: {
            title: "정밀 타겟팅",
            subtitle: "진짜 북극점 좌표 탐색 중...",
            successTitle: "타겟 포착",
            successSubtitle: "중력 렌즈 가이드 고정 완료",
            instruction: "탐사선을 싱귤래리티(중심부)로 이동시키세요",
            instructionSuccess: "최종 정렬 단계로 전환 중",
            detail: "북극성을 찾으세요. 적위(Dec) 및 적경(RA) 수동 레버를 조절하여 탐사선을 중력 렌즈의 빛나는 중심부로 이동시키세요."
        },
        step4: {
            title: "물리적 조절",
            subtitle: "천구의 중심을 향한 최종 조정 단계입니다.",
            coachingTuning: "“우주의 중심에 더 가까워지고 있습니다”",
            coachingAligned: "“우주의 중심에 도착했습니다”",
            subtext: "나사를 미세하게 조절하여 펄스를 안정화하세요.",
            button: "미션 완료",
            detail: "고도(Altitude) 및 방위각(Azimuth) 조절 나사를 미세하게 조정하세요. 북극성을 0.7° 오프셋 원(진북 극점) 안으로 이동시키세요. 펄스가 안정화되면 정렬이 완료됩니다.",
            altitude: "고도 (수직 조절)",
            azimuth: "방위각 (수평 조절)",
            up: "상",
            down: "하",
            left: "좌",
            right: "우"
        },
        final: {
            success: "정렬 완료! ✨",
            message: "이제 당신의 망원경은 우주의 일부가 되었습니다",
            button: "미션 다시 시작",
            saveResult: "결과 저장",
            restart: "다시 정렬하기",
            statsTitle: "최종 결과 레포트",
            offsetResult: "RA축 오프셋 측정값",
            stabilityScore: "센서 안정도 점수",
            timeTaken: "측정 소요 시간",
            tipTitle: "사용자 팁",
            tipContent: "정밀도를 유지하려면 30분마다 재정렬하는 것을 권장합니다."
        },
        error: {
            title: "정렬 실패 ⚠️",
            analysisTitle: "장애 원인 분석",
            causeAzimuth: "방위각(α) 변화율이 불규칙함",
            causePitch: "피치(β)가 ±10° 범위를 벗어남",
            causeNoise: "측정 노이즈가 과다하게 발생함",
            solutionTitle: "해결 방법",
            solutionLevel: "스마트폰을 최대한 수평으로 유지하세요",
            solutionMetal: "주변의 금속 물체(자석 등)를 멀리하세요",
            solutionSlow: "회전 속도를 더 천천히 유지하세요",
            solutionOutdoor: "GPS 수신이 원활한 실외에서 시도하세요",
            retry: "다시 시도",
            reset: "초기화"
        },
        permissions: {
            title: "필수 권한 확인 ⚠️",
            gpsTitle: "위치 접근 (GPS)",
            gpsDesc: "관측 지점의 좌표를 수집합니다",
            sensorTitle: "센서 접근 (자이로/나침반)",
            sensorDesc: "망원경의 물리적 회전을 감지합니다",
            cameraTitle: "카메라 접근 (선택)",
            cameraDesc: "증강 현실 가이드용",
            allow: "권한 요청",
            allowed: "허용됨 ✓",
            skip: "스킵",
            allAllowed: "모든 필수 권한이 허용되었습니다",
            help: "도움말"
        },
        dashboard: {
            title: "실시간 센서 데이터 📊",
            azimuth: "방위각 (α) - 수평 회전",
            pitch: "피치 (β) - 전후 기울기",
            roll: "롤 (γ) - 좌우 기울기",
            changeRate: "변화율",
            normalRange: "정상 범위: ±5°",
            stability: "신뢰도 및 안정성",
            initializing: "초기화 중... ◐",
            stable: "안정적 ✓",
            unstable: "불안정 ⚠️",
            veryUnstable: "매우 불안정 ✗",
            error: "센서 오류 ✗",
            feedbackFast: "⚠️ 회전 속도가 너무 빠릅니다",
            feedbackStable: "✓ 센서값이 안정되었습니다",
            feedbackIncreasing: "✓ 정렬도가 상승 중입니다",
            feedbackRemaining: "목표까지 남은 각도"
        }
    }
};
