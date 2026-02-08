import { create } from 'zustand';
import { missionService } from '../services/api';

interface MissionData {
    id: string | null;
    status: 'idle' | 'active' | 'completed' | 'failed';
    initialSensor: { alpha: number; beta: number; gamma: number; timestamp: number } | null;
    results: any | null;
}

interface MissionState {
    mission: MissionData;
    startMission: (sensor: any) => Promise<void>;
    recordResult: (result: any) => void;
    reset: () => void;
}

export const useMissionStore = create<MissionState>((set) => ({
    mission: {
        id: null,
        status: 'idle',
        initialSensor: null,
        results: null
    },

    startMission: async (sensor) => {
        try {
            const response = await missionService.startMission({
                initial_alpha: sensor.alpha,
                initial_beta: sensor.beta,
                initial_gamma: sensor.gamma,
                user_id: "anonymous",
                device_id: "browser",
                gps_location: {
                    latitude: 0, // Should be passed from GPS hook
                    longitude: 0,
                    accuracy: 0
                }
            });
            const missionId = response.mission_id;
            const sensorWithTimestamp = { ...sensor, timestamp: Date.now() };
            set({ mission: { id: missionId, status: 'active', initialSensor: sensorWithTimestamp, results: null } });
        } catch (error) {
            console.error('Failed to sync mission with backend:', error);
            // Fallback to local mission ID if backend fails
            const missionId = crypto.randomUUID();
            const sensorWithTimestamp = { ...sensor, timestamp: Date.now() };
            set({ mission: { id: missionId, status: 'active', initialSensor: sensorWithTimestamp, results: null } });
        }
    },

    recordResult: (result) => set((state) => ({
        mission: { ...state.mission, status: 'completed', results: result }
    })),

    reset: () => set({ mission: { id: null, status: 'idle', initialSensor: null, results: null } })
}));
