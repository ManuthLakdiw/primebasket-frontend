'use server';

import { fetchApi } from "@/util/api";
import {revalidatePath, revalidateTag} from "next/cache";
import {OrderStatus} from "@/app/admin/dashboard/orders/page";

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

        // @ts-ignore
        revalidateTag('reports-sales');

        // @ts-ignore
        revalidateTag('reports-status');

        // @ts-ignore
        revalidateTag('dashboard-summary')

        revalidatePath('/admin/dashboard/orders');

        return {
            success: true,
            data: result.data
        };

    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Network error occurred while placing order" };
    }
}


export async function getOrdersAction(status?: OrderStatus, page: number = 0, size: number = 10) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        if (status) queryParams.append('status', status);

        const tag = status ? `adminOrders-${status}` : 'adminOrders-all';

        const response = await fetchApi(`/orders?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'force-cache',
            next: {
                tags: [tag],
            }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        console.log(error, "error")
        return { success: false, error: "Network error" };
    }
}

export async function getOrderDetailsAction(orderId: string) {
    try {
        const response = await fetchApi(`/orders/${orderId}`, {
            method: 'GET',
            cache: 'no-store',

        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus, reason?: string) {
    try {
        const queryParams = new URLSearchParams({
            newStatus: status
        });

        if (reason) {
            queryParams.append('reason', reason);
        }

        const response = await fetchApi(`/orders/${orderId}/status?${queryParams.toString()}`, {
            method: 'PATCH',
        });

        if (response.ok) {
            revalidatePath('/admin/dashboard/orders');

            // @ts-ignore
            revalidateTag('reports-sales');

            // @ts-ignore
            revalidateTag('reports-status');

            // @ts-ignore
            revalidateTag('email-logs')

            // @ts-ignore
            revalidateTag('dashboard-summary')

            return { success: true, message: "Status updated successfully" };
        } else {
            const errorResult = await response.json().catch(() => null);
            return { success: false, error: errorResult?.message || "Failed to update status" };
        }
    } catch (error) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function getMyOrdersAction(page: number = 0, size: number = 10) {
    try {
        const response = await fetchApi(`/orders/my-orders?page=${page}&size=${size}`, {
            method: 'GET',
            cache: 'no-store',
        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}


export async function cancelMyOrderAction(orderId: string) {
    try {
        const response = await fetchApi(`/orders/${orderId}/cancel`, {
            method: 'PATCH',
        });

        if (response.ok) {
            // @ts-ignore
            revalidateTag('user-orders');
            // @ts-ignore
            revalidateTag('dashboard-summary');
            // @ts-ignore
            revalidateTag('reports-status');
            // @ts-ignore
            revalidateTag('adminOrders-all');

            revalidatePath('/admin/dashboard/orders');

            revalidatePath('/admin/dashboard/products');

            return { success: true, message: "Order cancelled successfully" };
        } else {
            const errorResult = await response.json().catch(() => null);
            return { success: false, error: errorResult?.message || "Failed to cancel order" };
        }
    } catch (error) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function getOrderDetailsByNumberAction(orderNumber: string) {
    try {
        const response = await fetchApi(`/orders/number/${orderNumber}`, {
            method: 'GET',
            cache: 'no-store',
        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}