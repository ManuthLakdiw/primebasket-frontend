'use server';

import { fetchApi } from "@/util/api";
import { revalidateTag } from "next/cache";

interface CreateOrderPayload {
    cartItemIds: number[];
    shippingAddress: {
        addressType: string;
        street: string;
        city: string;
        district: string;
        postalCode: string;
    };
}

export async function createOrderAction(payload: CreateOrderPayload) {
    try {
        const response = await fetchApi('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || (result && !result.success)) {
            return { success: false, error: result?.message || "Failed to place order" };
        }

        // @ts-ignore
        revalidateTag('user-cart');

        return {
            success: true,
            data: result.data
        };

    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Network error occurred while placing order" };
    }
}