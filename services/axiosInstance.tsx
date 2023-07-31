import axios, { AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

export const axiosI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosI.interceptors.request.use(
    async (config) => {
        //const token = localStorage.getItem('fitnessAppToken');
        const session = await getSession();
        const token = session?.jwt;
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export async function getAllUsers() {
    return await axiosI.get("/admin/all-users");
}

export async function getAllTrainings(): Promise<
    AxiosResponse<{ id: number; userId: number; startDateTime: Date; endDateTime: Date }[], any>
> {
    return await axiosI.get("/training/all-trainings");
}

export async function saveTraining(startdate: Date) {
    return await axiosI.post("/training/add-training", {
        startDateTime: startdate,
    });
}

export async function stopTraining(trainingId: number) {
    return await axiosI.patch("/training/stop-training/" + trainingId);
}

export async function getTrainingById(trainingId: number) {
    return await axiosI.get("/training/" + trainingId);
}

export async function getExercisesByTrainingId(trainingId: number) {
    return await axiosI.get("/training/" + trainingId + "/exercises");
}

export async function addEmptyExerciseEventToTraining(trainingId: number) {
    return await axiosI.post(`/training/${trainingId}/exerciseEvents`, {});
}
