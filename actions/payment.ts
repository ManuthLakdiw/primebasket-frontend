'use server'

import { fetchApi } from "@/util/api";
import {revalidateTag} from "next/cache";

export async function getPaymentDataAction(orderId: string) {
    try {
        const response = await fetchApi(`/payments/request/${orderId}`, {
            method: 'GET',
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return { success: false, error: result?.message || "Failed to get payment data" };
        }

        console.log("Payment Data:", result.data);


        // @ts-ignore
        revalidateTag('user-cart');

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}