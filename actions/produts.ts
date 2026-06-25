'use server'

import {ProductFormValues} from "@/util/validations";
import {fetchApi} from "@/util/api";
import {revalidatePath, revalidateTag} from "next/cache";

export async function createProductAction(data: ProductFormValues) {
    try {
        const formattedAttributes: Record<string, string> = {};
        data.attributes?.forEach(attr => {
            if (attr.key.trim() && attr.value.trim()) {
                formattedAttributes[attr.key.trim()] = attr.value.trim();
            }
        });

        const requestBody = {
            name: data.name.trim(),
            sku: data.sku.trim(),
            description: data.description?.trim() || "",
            price: data.price,
            stockQuantity: data.stockQuantity,
            categoryId: Number(data.categoryId),
            images: data.images,
            isFeatured: data.isFeatured,
            isActive: data.isActive,
            attributes: formattedAttributes,

            salePrice: data.salePrice !== '' && data.salePrice !== undefined ? data.salePrice : null,
            saleStartDate: data.saleStartDate !== '' ? data.saleStartDate : null,
            saleEndDate: data.saleEndDate !== '' ? data.saleEndDate : null,
        };

        const response = await fetchApi('/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok || (result && !result.success)) {
            return { success: false, error: result?.message || "Failed to create product" };
        }

        revalidatePath('/admin/dashboard/products');
        revalidatePath('/admin/dashboard/categories');


        // @ts-ignore
        revalidateTag('products-public-list');

        return { success: true, data: result.data || result };

    } catch (error) {
        console.error("Create Product Error:", error);
        return { success: false, error: "Network error occurred while creating product" };
    }
}

export async function updateProductAction(id: number, data: ProductFormValues) {
    try {
        const formattedAttributes: Record<string, string> = {};
        data.attributes?.forEach(attr => {
            if (attr.key.trim() && attr.value.trim()) {
                formattedAttributes[attr.key.trim()] = attr.value.trim();
            }
        });

        const requestBody = {
            name: data.name.trim(),
            sku: data.sku.trim(),
            description: data.description?.trim() || "",
            price: data.price,
            stockQuantity: data.stockQuantity,
            categoryId: Number(data.categoryId),
            images: data.images,
            isFeatured: data.isFeatured,
            isActive: data.isActive,
            attributes: formattedAttributes,

            salePrice: data.salePrice !== '' && data.salePrice !== undefined ? data.salePrice : null,
            saleStartDate: data.saleStartDate !== '' ? data.saleStartDate : null,
            saleEndDate: data.saleEndDate !== '' ? data.saleEndDate : null,
        };

        const response = await fetchApi(`/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok || (result && !result.success)) {
            return { success: false, error: result?.message || "Failed to update product" };
        }

        revalidatePath('/admin/dashboard/products');


        // @ts-ignore
        revalidateTag('products-public-list');

        return { success: true, data: result.data || result };

    } catch (error) {
        console.error("Update Product Error:", error);
        return { success: false, error: "Network error occurred while updating product" };
    }
}

export async function getAllProductsAction(page: number, size: number) {
    try {
        const response = await fetchApi(`/products?page=${page}&size=${size}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-list'] }
        });

        const result = await response.json();

        if (!result.success && !result.content) {
            return { success: false, error: "Failed to fetch products" };
        }

        return { success: true, data: result };
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return { success: false, error: "Network error occurred" };
    }
}

export async function getProductById(id: number) {
    try {
        const response = await fetchApi(`/products/public/${id}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-list'] }
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: "Failed to fetch product" };
        }

        return { success: true, data: result.data };
    } catch (error) {
        console.error("Fetch Product Error:", error);
        return { success: false, error: "Network error occurred" };
    }
}

export async function toggleProductActiveAction(id: number, newStatus: boolean) {
    try {
        const response = await fetchApi(`/products/${id}/active?status=${newStatus}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            return { success: false, error: "Failed to update active status" };
        }

        revalidatePath('/admin/dashboard/products');


        // @ts-ignore
        revalidateTag('products-public-list');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function toggleProductFeaturedAction(id: number, newStatus: boolean) {
    try {
        const response = await fetchApi(`/products/${id}/featured?status=${newStatus}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            return { success: false, error: "Failed to update featured status" };
        }

        revalidatePath('/admin/dashboard/products');


        // @ts-ignore
        revalidateTag('products-public-list');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function deleteProductAction(id: number) {
    try {
        const response = await fetchApi(`/products/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to delete" };
        }

        revalidatePath('/admin/dashboard/products');
        revalidatePath('/admin/dashboard/categories');

        // @ts-ignore
        revalidateTag('products-public-list');
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function getProductsByCategoryId(
    categoryId: number,
    keyword: string = '',
    page: number = 0,
    size: number = 10
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (keyword.trim() !== '') {
            queryParams.append('keyword', keyword.trim());
        }

        const response = await fetchApi(`/products/public/category/${categoryId}?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}


export async function getTopFeaturedProducts(limit: number = 4) {
    try {
        const response = await fetchApi(`/products/public/featured/preview?limit=${limit}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch featured products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}


export async function getFeaturedProducts(
    keyword: string = '',
    page: number = 0,
    size: number = 10
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (keyword.trim() !== '') {
            queryParams.append('keyword', keyword.trim());
        }

        const response = await fetchApi(`/products/public/featured?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch featured products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function getTopOnSaleProducts(limit: number = 4) {
    try {
        const response = await fetchApi(`/products/public/onsale/preview?limit=${limit}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch on-sale products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function getOnSaleProducts(
    keyword: string = '',
    page: number = 0,
    size: number = 10
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (keyword.trim() !== '') {
            queryParams.append('keyword', keyword.trim());
        }

        const response = await fetchApi(`/products/public/onsale?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to fetch on-sale products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function searchAllProducts(
    keyword: string = '',
    page: number = 0,
    size: number = 10
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (keyword.trim() !== '') {
            queryParams.append('keyword', keyword.trim());
        }

        const response = await fetchApi(`/products/public/search?${queryParams.toString()}`, {
            method: 'GET',
            cache: 'force-cache',
            next: { tags: ['products-public-list'] }
        });
        const result = await response.json();

        if (!result.success) {
            return { success: false, error: result.message || "Failed to search products" };
        }

        return { success: true, data: result.data };
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

