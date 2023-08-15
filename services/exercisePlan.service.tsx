

import { axiosI } from "./axiosInstance";

export function getAllPlans() {
    return axiosI.get("/plans");
}

export function createEmptyPlan() {
    return axiosI.post("/plans", {});
}

export function createPlan(plan: { name: string; description: string }) {
    return axiosI.post("/plans", plan);
}


// Single plan

export function getPlanById(planId: number) {
    return axiosI.get(`/plans/${planId}`);
}

export function updatePlan(planId: number, plan: { name: string; description: string }) {
    return axiosI.patch(`/plans/${planId}`, plan);
}

export function deletePlan(planId: number) {
    return axiosI.delete(`/plans/${planId}`);
}

// Exercise-Types in plan

export function addExerciseToPlan(planId: number, exerciseId: number) {
    return axiosI.post(`/plans/${planId}/exercise-types/${exerciseId}`);
}

export function removeExerciseFromPlan(planId: number, exerciseId: number) {
    return axiosI.post(`/plans/${planId}/exercise-types/${exerciseId}`);
}

