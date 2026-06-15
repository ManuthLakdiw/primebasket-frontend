"use server";

import {RegisterFormValues} from "@/util/validations";
import {fetchApi} from "@/util/api";
import {cookies} from "next/headers";

export async function registerUserAction(data: RegisterFormValues) {
    try {
        const { confirmPassword, ...backendData } = data;

        const response = await fetchApi("/auth/register", {
            method: "POST",
            body: JSON.stringify(backendData),
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                error: result.message || "Registration failed. Please try again."
            };
        }

        return {
            success: true
        };

    } catch (error) {
        console.error("Backend Connection Error:", error);
        return {
            success: false,
            error: "Cannot connect to the server. Please check your internet connection."
        };
    }
}

export async function verifyOtpAction(data: { email: string; otp: string }) {
   try {
       const response = await fetchApi('/auth/verify-otp', {
           method: 'POST',
           body: JSON.stringify(data),
       });
       const result = await response.json();
       return { success: response.ok, message: result.message || "Failed to verify" };
   }catch (error) {
       console.error("Backend Connection Error:", error);
       return {
           success: false,
           error: "Cannot connect to the server. Please check your internet connection."
       };
   }
}

export async function resendOtpAction(data: { email: string }) {
   try {
       const response = await fetchApi('/auth/resend-otp', {
           method: 'POST',
           body: JSON.stringify(data),
       });
       const result = await response.json();
       return { success: response.ok, data: result };
   }catch (error) {
       console.error("Backend Connection Error:", error);
       return {
           success: false,
           error: "Cannot connect to the server. Please check your internet connection."
       };
   }
}

export async function loginUserAction(data: { email: string; password: string }) {
    try {
        const response = await fetchApi('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.message || "Login failed. Please check your credentials."
            };
        }

        const { accessToken, refreshToken } = result.data;
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15 // 15 min
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return { success: true };

    } catch (error) {
        console.error("Backend Connection Error:", error);
        return {
            success: false,
            error: "Cannot connect to the server. Please check your internet connection."
        }
    }
}


export async function googleLoginAction(idToken: string) {
    try {
        const response = await fetchApi('/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        const result = await response.json();

        if (result.success && result.data) {
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

            return { success: true };
        }

        return { success: false, error: result.message || "Google Login failed" };

    } catch (error) {
        return { success: false, error: "Something went wrong during Google Login" };
    }
}


export async function facebookLoginAction(fbAccessToken: string) {
    try {
        const response = await fetchApi('/auth/facebook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: fbAccessToken }),
        });

        const result = await response.json();

        if (result.success && result.data) {
            const { accessToken, refreshToken } = result.data;
            const cookieStore = await cookies();
            const isProduction = process.env.NODE_ENV === 'production';

            cookieStore.set('accessToken', accessToken, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/', maxAge: 60 * 15 });
            cookieStore.set('refreshToken', refreshToken, { httpOnly: true, secure: isProduction, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });

            return { success: true };
        }
        return { success: false, error: result.message || "Facebook Login failed" };
    } catch (error) {
        return { success: false, error: "Something went wrong during Facebook Login" };
    }
}