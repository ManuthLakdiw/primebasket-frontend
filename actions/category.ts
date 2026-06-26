'use server';

import { fetchApi } from "@/util/api";
import {revalidatePath, revalidateTag} from "next/cache";

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


        // @ts-ignore
        revalidateTag('categories-list');

        // @ts-ignore
        revalidateTag('categories-dropdown');

        // @ts-ignore
        revalidateTag('categories-public');

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to update" };
        }

        // @ts-ignore
        revalidateTag('categories-list');

        // @ts-ignore
        revalidateTag('categories-dropdown');

        // @ts-ignore
        revalidateTag('categories-public');

        revalidatePath('/admin/dashboard/products');


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

        // @ts-ignore
        revalidateTag('categories-list');

        // @ts-ignore
        revalidateTag('categories-dropdown');

        // @ts-ignore
        revalidateTag('categories-public');

        revalidatePath('/admin/dashboard/products');

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
            next: { tags: ['categories-dropdown'] }
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

export async function getAllPublicCategories() {
    try {
        const response = await fetchApi('/categories/public', {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['categories-public'] }
        });

        const json = await response.json();

        if (!response.ok || !json.success) {
            return { success: false, error: json.message || "Failed to fetch categories" };
        }

        return { success: true, data: json.data };

    } catch (e) {
        return { success: false, error: "Network error occurred while fetching categories" };
    }
}