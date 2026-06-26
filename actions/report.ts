'use server'

import { fetchApi } from "@/util/api";

export async function getSalesRevenueAction() {
    try {
        const response = await fetchApi('/reports/sales-revenue', {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['reports-sales'] }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data || result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Network error" };
    }
}

export async function getOrderStatusDistributionAction() {
    try {
        const response = await fetchApi('/reports/status-distribution', {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['reports-status'] }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data || result };
    } catch (error) {
        console.error(error); // <-- add this
        return { success: false, error: "Network error" };
    }
}