'use server';

import { cookies } from 'next/headers';
import {fetchApi} from "@/util/api";
import {AddressFormValues} from "@/util/validations";
import {revalidateTag} from "next/cache";

export async function getMyDetailsAction() {
    try {
        const response = await fetchApi('/users/me', {
            method: 'GET',
        });

        if (!response.ok) {
            return { success: false, error: "Session expired" };
        }

        const result = await response.json();

        return {
            success: true,
            data: result.data
        };

    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function updateMyDetailsAction(firstName: string, lastName: string, phoneNumber: string) {
    try {
        const response = await fetchApi('/users/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, phoneNumber }),
        });

        const result = await response.json();

        if (result.success) {
            return { success: true, data: result.data };
        } else {
            return { success: false, error: result.message || "Failed to update details" };
        }
    }catch (e) {
        return { success: false, error: "Network error" };
    }

}

export async function updatePasswordAction(currentPassword: string, newPassword: string) {
    try {
        const response = await fetchApi('/users/me/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, error: result.message || "Failed to update password" };
        }
    } catch (e) {
        return { success: false, error: "Network error" };
    }
}


export async function addAddressAction(address: AddressFormValues) {
    try {
        const response = await fetchApi('/users/addresses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address),
        });

        const result = await response.json();

        if (result.success) {
            return { success: true, message: result.data };
        } else {
            return { success: false, error: result.message || "Failed to add address" };
        }
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function updateAddressAction(address: AddressFormValues) {
    try {
        const response = await fetchApi('/users/addresses', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address),
        });

        const result = await response.json();

        if (result.success) {
            return { success: true, message: result.data };
        } else {
            return { success: false, error: result.message || "Failed to update address" };
        }
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function deleteAddressAction(addressType: string) {
    try {
        const response = await fetchApi(`/users/addresses/${addressType}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
            return { success: true, message: result.data };
        } else {
            return { success: false, error: result.message || "Failed to delete address" };
        }
    } catch (e) {
        return { success: false, error: "Network error occurred" };
    }
}

export async function getAllCustomersAction(page: number, size: number) {
    try {
        console.log("Fetching users with page: ", page, " and size: ", size, "")
        const response = await fetchApi(`/users?page=${page}&size=${size}`, {
            method: 'GET',
            next: {
                tags: ['all-users'],
                revalidate: 3600
            }
        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function getUserFullDetailsAction(userId: string) {
    try {
        const response = await fetchApi(`/users/${userId}`, {
            method: 'GET',
        });

        const result = await response.json();
        return { success: response.ok, data: result.data };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}


export async function toggleUserActivationAction(userId: string) {
    try {
        const response = await fetchApi(`/users/${userId}/toggle-status`, {
            method: 'PUT',
        });

        if (response.ok) {

            const result = await response.json();
            // @ts-ignore
            revalidateTag('all-users');

            return { success: true, data: result.data };
        } else {
            return { success: false, error: "Failed to update status" };
        }
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}




export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
}

