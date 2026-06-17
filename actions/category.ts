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

        revalidateTag('categories-list', 'max');
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

        revalidateTag('categories-list', 'max');
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

        revalidateTag('categories-list', 'max');
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function getAllCategoriesAction(page: number, size: number) {
    try {
        const response = await fetchApi(`/categories?page=${page}&size=${size}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['categories-list'] }
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


export async function getCategoriesForDropdownAction() {
    try {
        const response = await fetchApi('/categories/dropdown', {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['categories-list'] }

        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch categories for dropdown" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error occurred while fetching categories" };
    }
}