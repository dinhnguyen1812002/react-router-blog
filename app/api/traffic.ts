import { apiClient } from "./client";

export interface TrafficPoint {
    period: string;
    count: number;
    zone: string;
    type: string;
}

export interface TrafficStatsResponse {
    periodType: "day" | "month" | "year";
    start: string;
    end: string;
    access_count: number;
    points: TrafficPoint[];
}

export const trafficApi = {
    getStats: async (period: "day" | "month" | "year") => {
        const response = await apiClient.get<TrafficStatsResponse>('/traffic/stats', {
            params: { period }
        });
        return response.data;
    }
};
