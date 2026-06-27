'use server'

import { fetchApi } from "@/util/api";

export async function getDashboardSummaryAction() {
    try {
        const response = await fetchApi(`/dashboard/summary`, {
            method: 'GET',
            cache: 'force-cache',
            next: {
                tags: ['dashboard-summary']
            }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data || result };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}