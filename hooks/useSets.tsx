import { useEffect, useState } from "react";
import { Set } from "global-types";
import { addSetToExerciseEvent, getSetsByExerciseId } from "@/services/axiosInstance";

interface AddSet {
    weight?: number;
    reps?: number;
}

export function useSets(exerciseId: string | number) {
    const [sets, setSets] = useState<Set[]>([]);
    const [setsLoading, setSetsLoading] = useState<boolean>(true);
    const exerciseIdNumber = parseInt(exerciseId as string);
    const [unorderdSets, setUnorderedSets] = useState<Set[]>([]);

    const updateSets = () => {
        setSetsLoading(true);
        getSetsByExerciseId(exerciseIdNumber)
            .then((res) => {
                setUnorderedSets(res.data);
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setSetsLoading(false);
            });
    }

    useEffect(() => {
        setSetsLoading(true);
        getSetsByExerciseId(exerciseIdNumber)
            .then((res) => {
                setUnorderedSets(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setSetsLoading(false);
            });
    }, [exerciseIdNumber]);

    useEffect(() => {
        setSets(unorderdSets.sort((a, b) => a.orderNumber - b.orderNumber));
    }, [unorderdSets])

    const addSet = (set: AddSet) => { 
        addSetToExerciseEvent(exerciseIdNumber, set.weight || 0, set.reps || 0);
        updateSets();
    }

    return { sets, addSet, updateSets, setsLoading }
}