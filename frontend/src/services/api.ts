import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const missionService = {
    startMission: async (data: any) => {
        const response = await api.post('/missions/start', data);
        return response.data;
    },
    updateTelemetry: async (missionId: string, readings: any[]) => {
        const response = await api.post(`/missions/${missionId}/sensor-data`, { readings });
        return response.data;
    },
    completeMission: async (missionId: string, results: any) => {
        const response = await api.post(`/missions/${missionId}/complete`, results);
        return response.data;
    }
};

export default api;
