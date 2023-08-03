import { ExerciseEvent } from "@/pages/trainings/[id]";
import { addEmptyExerciseEventToTraining, getExercisesByTrainingId } from "@/services/axiosInstance";
import { useEffect, useState } from "react";


export function useExerciseEvents(trainingId: string | number) {
    const [exerciseEvents, setExerciseEvents] = useState<ExerciseEvent[]>([]);
    const [exerciseEventsLoading, setExerciseEventsLoading] = useState<boolean>(true);
    const trainingIdNumber = parseInt(trainingId as string);
    const [unorderdExerciseEvents, setUnorderedExerciseEvents] = useState<ExerciseEvent[]>([]);

    const updateExerciseEvents = () => {
        setExerciseEventsLoading(true);
        getExercisesByTrainingId(trainingIdNumber)
            .then((res) => {
                setUnorderedExerciseEvents(res.data);
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setExerciseEventsLoading(false);
            });
    }

    useEffect(() => {
        setExerciseEventsLoading(true);
        getExercisesByTrainingId(trainingIdNumber)
            .then((res) => {
                setUnorderedExerciseEvents(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setExerciseEventsLoading(false);
            });
    }, [trainingIdNumber]);

    useEffect(() => {
        setExerciseEvents(unorderdExerciseEvents.sort((a, b) => a.orderNumber - b.orderNumber));
    }, [unorderdExerciseEvents])

    const addExerciseEvent = (exerciseEvent: ExerciseEvent) => {
        addEmptyExerciseEventToTraining(trainingIdNumber)
            .then((res) => {
                updateExerciseEvents();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return { exerciseEvents, addExerciseEvent, updateExerciseEvents, exerciseEventsLoading }
}