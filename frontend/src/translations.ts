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
    };
    step2: {
        title: string;
        subtitle: string;
        confidence: string;
        instruction: string;
        button: string;
        detail: string;
        direction: string;
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
            detail: "Attach your smartphone to the telescope eyepiece. Ensure the camera is centered and the aurora pulse is stable."
        },
        step2: {
            title: "ORBIT DANCE",
            subtitle: "Aligning celestial coordinates...",
            confidence: "ALIGNMENT CONFIDENCE",
            instruction: "SWING THE TELESCOPE SLOWLY",
            button: "LOCK ORBIT",
            detail: "Rotate the telescope's Right Ascension (RA) axis slowly by 60 degrees. Maintain a steady pace to allow the AI to map the celestial curvature.",
            direction: "ROTATE RIGHT (CLOCKWISE)"
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
            button: "RESTART MISSION"
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
            detail: "스마트폰을 망원경 접안렌즈에 장착하세요. 카메라가 중앙에 위치하고 오로라 펄스가 안정적인지 확인하세요."
        },
        step2: {
            title: "스윙 캘리브레이션",
            subtitle: "천체 좌표 정렬 중...",
            confidence: "정렬 신뢰도",
            instruction: "망원경을 천천히 회전시켜 주세요",
            button: "궤도 고정",
            detail: "망원경의 적경(RA) 축을 60도 정도 천천히 회전시키세요. AI가 천구의 곡률을 매핑할 수 있도록 일정한 속도를 유지해 주세요.",
            direction: "오른쪽으로 회전 (시계 방향)"
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
            success: "CLEAR SKIES!",
            message: "이제 당신의 망원경은 우주의 일부가 되었습니다",
            button: "미션 다시 시작"
        }
    }
};
