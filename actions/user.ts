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

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
}