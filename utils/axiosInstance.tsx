import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('fitnessAppToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    }, error => {
        Promise.reject(error)
    });
