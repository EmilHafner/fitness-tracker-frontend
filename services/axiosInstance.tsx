import { ExerciseEvent } from "@/pages/trainings/[id]";
import axios, { AxiosResponse } from "axios";
import { ExerciseType } from "global-types";
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
    return await axiosI.get("/training/" + trainingId + "/exerciseEvents");
}

export async function addEmptyExerciseEventToTraining(trainingId: number): Promise<AxiosResponse<ExerciseEvent, any>> {
    return await axiosI.post(`/training/${trainingId}/exerciseEvents`, {});
}

export async function searchExerciseTypesByName(name: string | undefined): Promise<AxiosResponse<ExerciseType[], any>> {
    if (!(name && name.trim().length > 0)) return await axiosI.get("/exerciseTypes/all");
    return await axiosI.get(`/exerciseTypes/search/${name}`);
}

export async function setExerciseTypeOnExercise(exerciseId: number, exerciseTypeId: number) {
    return await axiosI.put(`/exerciseEvents/${exerciseId}/exerciseType/${exerciseTypeId}`);
}

export async function getExerciseEventById(exerciseEventId: number): Promise<AxiosResponse<ExerciseEvent, any>> {
    return await axiosI.get(`/exerciseEvents/${exerciseEventId}`);
}

export async function getSetsByExerciseId(exerciseId: any) {
    return await axiosI.get(`/exerciseEvents/${exerciseId}/sets`);
}

export async function addSetToExerciseEvent({
    exerciseEventId,
    weight,
    reps,
}: {
    exerciseEventId: any;
    weight: number;
    reps: number;
}) {
    return await axiosI.post(`/exerciseEvents/${exerciseEventId}/sets`, {
        weight,
        reps,
    });
}

export async function updateSet({
    setId,
    weight,
    reps,
}: {
    setId: number;
    weight: string | number;
    reps: string | number;
}) {
    return await axiosI.put(`/trainingsSets/${setId}`, {
        weight,
        reps,
    });
}

export function deleteTrainingsSet(setId: number) {
    return axiosI.delete(`/trainingsSets/${setId}`);
}

export function getAllExerciseTypes() {
    return axiosI.get("/exerciseTypes/all");
}

export function saveExerciseType(exerciseType: ExerciseType) {
    return axiosI.post("/exerciseTypes/add", exerciseType);
}

export function deleteExerciseType(exerciseTypeId: number) {
    return axiosI.delete("/exerciseTypes/delete/" + exerciseTypeId);
}
