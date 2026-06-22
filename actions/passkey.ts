'use server';

import { fetchApi } from "@/util/api";
import {cookies} from "next/headers";

export async function getRegisterOptionsAction() {
    try {
        const response = await fetchApi('/users/passkeys/register-options', {
            method: 'POST',
        });

        if (!response.ok) return { success: false, error: "Failed to get options" };

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function verifyRegistrationAction(credential: any, deviceName: string) {
    try {
        const response = await fetchApi('/users/passkeys/register-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credential: credential,
                deviceName: deviceName
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Verification Error Response:", err);
            return { success: false, error: "Verification failed" };
        }

        return { success: true };
    } catch (e) {
        return { success: false, error: "Network error" };
    }
}

export async function getLoginOptionsAction(email: string) {
    try {
        const response = await fetchApi(`/auth/passkeys/login-options?email=${encodeURIComponent(email)}`, {
            method: 'POST',
        });

        if (!response.ok) return { success: false, error: "Email not registered for Passkeys" };

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}

export async function verifyPasskeyLoginAction(credential: any) {
    try {
        const response = await fetchApi('/auth/passkeys/login-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
        });

        if (!response.ok) return { success: false, error: "Invalid Passkey" };

        const result = await response.json();

        const { accessToken, refreshToken } = result.data;
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15 // 15 mins
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });


        return { success: true, data: result };
    } catch (e) {
        return { success: false, error: "Network error" };
    }
}

export async function deletePasskeyAction(id: string) {
    try {
        const response = await fetchApi(`/users/passkeys/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) return { success: false, error: "Failed to delete passkey" };
        return { success: true };
    } catch (error) {
        return { success: false, error: "Network error" };
    }
}
