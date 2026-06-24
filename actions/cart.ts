'use server'

import { fetchApi } from "@/util/api";
import { revalidateTag } from "next/cache";

export async function getCartAction() {
    try {
        const response = await fetchApi('/cart', {
            method: 'GET',
            cache: 'no-store',
            next: { tags: ['user-cart'] }
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result?.message || "Failed to fetch cart" };
        }

        return { success: true, data: result.data || result };
    } catch (error) {
        console.error("Get Cart Error:", error);
        return { success: false, error: "Network error occurred while fetching cart" };
    }
}

export async function addToCartAction(productId: number, quantity: number = 1) {
    try {
        const response = await fetchApi('/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result?.message || "Failed to add item to cart" };
        }

        // @ts-ignore
        revalidateTag('user-cart');
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error("Add to Cart Error:", error);
        return { success: false, error: "Network error occurred while adding to cart" };
    }
}

export async function updateCartQuantityAction(cartItemId: number, quantity: number) {
    try {
        const response = await fetchApi(`/cart/update/${cartItemId}?quantity=${quantity}`, {
            method: 'PUT',
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result?.message || "Failed to update quantity" };
        }


        // @ts-ignore
        revalidateTag('user-cart');
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error("Update Quantity Error:", error);
        return { success: false, error: "Network error occurred while updating quantity" };
    }
}

export async function removeFromCartAction(cartItemId: number) {
    try {
        const response = await fetchApi(`/cart/remove/${cartItemId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result?.message || "Failed to remove item" };
        }

        // @ts-ignore
        revalidateTag('user-cart');
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error("Remove Item Error:", error);
        return { success: false, error: "Network error occurred while removing item" };
    }
}

export async function clearCartAction() {
    try {
        const response = await fetchApi('/cart/clear', {
            method: 'DELETE',
        });

        if (!response.ok) {
            const result = await response.json();
            return { success: false, error: result?.message || "Failed to clear cart" };
        }

        // @ts-ignore
        revalidateTag('user-cart');
        return { success: true };
    } catch (error) {
        console.error("Clear Cart Error:", error);
        return { success: false, error: "Network error occurred while clearing cart" };
    }
}