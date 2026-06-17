'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.API_BASE_URL;

export async function fetchApi(
    endpoint: string,
    options: RequestInit & { next?: { tags?: string[]; revalidate?: number | false } } = {}
) {
    const url = `${BASE_URL}${endpoint}`;

    const cookieStore = await cookies();

    let accessToken = cookieStore.get('accessToken')?.value;

    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const finalHeaders = {
        ...headers,
        ...(options.headers as Record<string, string>),
    };

    console.log("FETCHING URL TO BACKEND:", url);

    let response = await fetch(url, {
        ...options,
        headers: finalHeaders,
    });


    if (response.status === 401) {
        console.log("Access Token Expired. Attempting to refresh...");
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            console.log("No Refresh Token found. Clearing cookies...");
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            return response;
        }

        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshRes.ok) {
            console.log("Token successfully refreshed!");
            const result = await refreshRes.json();

            const newAccessToken = result.data.accessToken;
            const newRefreshToken = result.data.refreshToken;

            const isProduction = process.env.NODE_ENV === 'production';

            cookieStore.set('accessToken', newAccessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 15
            });

            if (newRefreshToken) {
                cookieStore.set('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7
                });
            }

            finalHeaders["Authorization"] = `Bearer ${newAccessToken}`;
            response = await fetch(url, {
                ...options,
                headers: finalHeaders,
            });

        } else {
            console.log("Refresh Token Expired or Invalid. Clearing cookies...");
            const cookieStore = await cookies();
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            return response;
        }
    }

    if (response.status === 403) {
        console.log("Access Denied (403). User does not have permission.");
    }

    return response;
}