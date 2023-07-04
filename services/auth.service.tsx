import axios from "axios";

const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/auth",
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function registerUser(firstName: string, lastName: string, username: string, password: string) {
    return await axiosAuth.post("/register", {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password
    });
}

export async function loginUser(username: string, password: string) {
    return await axiosAuth.post("/authenticate", {
        username: username,
        password: password
    });
}