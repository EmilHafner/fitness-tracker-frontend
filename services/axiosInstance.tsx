import axios from "axios";
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
    console.log(token);
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

export async function getAllTrainings() {
  return await axiosI.get("/training/all-trainings");
}

export async function saveTraining(startdate: Date) {
  return await axiosI.post("/training/add-training", {
    startDateTime: startdate,
  });
}
