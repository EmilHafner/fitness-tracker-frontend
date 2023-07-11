import axios from "axios";

export const axiosI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosI.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('fitnessAppToken');
        console.log(token);
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    }, error => {
        Promise.reject(error)
    });

export async function getAllUsers(){
    return await axiosI.get("/admin/all-users");
}
