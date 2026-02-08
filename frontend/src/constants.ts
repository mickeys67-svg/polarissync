export const STEPS = {
    PERMISSIONS: 0,
    DOCKING: 1,
    TELEMETRY: 2,
    ORBIT_DANCE: 3,
    EVENT_HORIZON: 4,
    ALIGNMENT_PULSE: 5,
};

export const TRANSITION_DURATION = 1.5; // seconds

export const SOUNDS = {
    BG_AMBIENCE: '/sounds/space_ambience.mp3',
    STEP_COMPLETE: '/sounds/lock_chime.mp3',
    MISSION_SUCCESS: '/sounds/mission_complete.mp3',
};

export const ALIGNMENT_CONFIG = {
    NCP_OFFSET_DEG: 0.7,
    ROTATION_SPEED: 0.5,
    GRAVITY_STRENGTH: 0.05,
};
