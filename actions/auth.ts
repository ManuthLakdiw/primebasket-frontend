"use server";

import {RegisterFormValues} from "@/util/validations";
import {fetchApi} from "@/util/api";

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