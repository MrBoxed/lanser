import axios from "axios";

export const instance = axios.create({
    // baseURL: import.meta.env.VITE_SERVER_BASE_URL // can use when using env variable
    baseURL: "http://localhost:27110/api"
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");


    // Ensure headers is not undefined
    config.headers = config.headers || {};

    const isPublicRoute =
        config.url?.includes("/auth/login") || config.url?.includes("/auth/signup");

    if (token && !isPublicRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});