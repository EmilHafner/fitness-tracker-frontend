import { searchExerciseTypesByName, setExerciseTypeOnExercise } from "@/services/axiosInstance";
import { ExerciseType } from "global-types";
import { useEffect, useState } from "react";


export function useExerciseTypes(initialType?: string) {
    // exerciseTypes, searchExerciseTypesByName(), exerciseTypesLoading
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
    const [exerciseTypesLoading, setExerciseTypesLoading] = useState<boolean>(true);
    const [unorderdExerciseTypes, setUnorderedExerciseTypes] = useState<ExerciseType[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(initialType || "");

    const updateExerciseTypes = () => {
        setExerciseTypesLoading(true);
        searchExerciseTypesByName(searchTerm)
            .then((res) => {
                setUnorderedExerciseTypes(res.data);
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setExerciseTypesLoading(false);
            });
    }

    const saveExerciseType = (exerciseId: number, exerciseTypeId: number) => {
        setExerciseTypeOnExercise(exerciseId, exerciseTypeId);
    }

    useEffect(() => {
        setExerciseTypesLoading(true);
        searchExerciseTypesByName(searchTerm)
            .then((res) => {
                setUnorderedExerciseTypes(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setExerciseTypesLoading(false);
            });
    }, [searchTerm]);

    useEffect(() => {
        setSearchTerm(initialType || "")
    }, [initialType]);

    useEffect(() => {
        setExerciseTypes(unorderdExerciseTypes.sort((a, b) => a.name.localeCompare(b.name)));
    }, [unorderdExerciseTypes])
    
    return { exerciseTypes, updateExerciseTypes, exerciseTypesLoading, searchTerm, setSearchTerm, saveExerciseType }
}