'use server'

import { fetchApi } from "@/util/api";

export async function getEmailLogsAction(page: number = 0, size: number = 10) {
    try {
        const response = await fetchApi(`/email-logs?page=${page}&size=${size}`, {
            method: 'GET',
            cache: 'force-cache',
            next: {
                tags: ['email-logs', `email-logs-${page}-${size}`]
            }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data || result };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}