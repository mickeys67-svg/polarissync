import { create } from 'zustand';

interface SensorState {
    alpha: number;
    beta: number;
    gamma: number;
    isStable: boolean;
    stdDev: number;
    history: { alpha: number; beta: number; timestamp: number }[];

    setOrientation: (data: { alpha: number; beta: number; gamma: number; isStable: boolean; stdDev: number }) => void;
    clearHistory: () => void;
}

export const useSensorStore = create<SensorState>((set) => ({
    alpha: 0,
    beta: 0,
    gamma: 0,
    isStable: false,
    stdDev: 0,
    history: [],

    setOrientation: (data) => set((state) => ({
        ...data,
        history: [...state.history.slice(-100), { ...data, timestamp: Date.now() }]
    })),

    clearHistory: () => set({ history: [] })
}));
