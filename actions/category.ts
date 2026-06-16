'use server';
import {fetchApi} from "@/util/api";
import {revalidateTag} from "next/cache";

export async function createCategoryAction(data: { name: string; description?: string }) {
    try {
        const response = await fetchApi('/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to create" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

// 2. Update Category
export async function updateCategoryAction(id: number, data: { name: string; description?: string }) {
    try {
        const response = await fetchApi(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to update" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function deleteCategoryAction(id: number) {
    try {
        const response = await fetchApi(`/categories/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to delete" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function getAllCategoriesAction(page: number, size: number) {
    try {
        const response = await fetchApi(`/categories?page=${page}&size=${size}`, {
            method: 'GET',
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}