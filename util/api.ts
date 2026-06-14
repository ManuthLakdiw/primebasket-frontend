const BASE_URL = process.env.API_BASE_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    console.log("🔥 FETCHING URL TO BACKEND:", url);
    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const finalHeaders = {
        ...headers,
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
        ...options,
        headers: finalHeaders,
    });

    return response;
}