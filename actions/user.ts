'use server';
import { cookies } from 'next/headers';
import {fetchApi} from "@/util/api";

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


export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
}

