import { addEmptyExerciseEventToTraining, axiosI } from "@/services/axiosInstance";
import { AddIcon, TimeIcon } from "@chakra-ui/icons";
import { Skeleton, useToast } from "@chakra-ui/react";
import {
    differenceInMilliseconds,
    differenceInMinutes,
    differenceInSeconds,
    format,
    formatDistanceToNow,
    formatDistanceToNowStrict,
    getMilliseconds,
    roundToNearestMinutes,
} from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getExercisesByTrainingId, getTrainingById } from "@/services/axiosInstance";
import { errorToast } from "@/utils/standardToasts";
import Button from "@/components/basics/Button";
import ExerciseEventComponent from "@/components/training/exercise/ExerciseEventComponent";

interface Set {
    id: number;
    weight?: number;
    reps?: number;
}
interface ExerciseType {
    id: number;
    name: string;
    bodypart?: string;
}

export interface ExerciseEvent {
    id: number;
    exerciseType: ExerciseType;
    sets?: Array<Set>;
}

interface Training {
    id: number;
    startDateTime: Date;
    endDateTime?: Date;
    exerciseEvents?: Array<ExerciseEvent>;
}

export default function Training() {
    const router = useRouter();
    const [training, setTraining] = useState({} as Training);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const [loadNewExercise, setLoadNewExercise] = useState(false);
    const [trainingActive, setTrainingActive] = useState(false);

    const loadTrainings = useCallback(() => {
        getTrainingById(parseInt(router.query.id as string))
            .then((res) => {
                setTraining(res.data);
                setTrainingActive(res.data && !res.data.endDateTime);
            })
            .catch((e) => {
                toast(errorToast("An Error occured", e.message));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [router.query.id, toast]);

    // Load training on first render
    useEffect(() => {
        setIsLoading(true);
        if (!router.isReady) return; // Make sure that no call is mady without a training-id
        loadTrainings();
    }, [router, toast, loadTrainings]);

    // Add or update an exercise to the training
    const addOrUpdateExerciseInTraining = (exerciseEvent?: ExerciseEvent) => {
        // If exercise is undefined, create a new empty exercise

        //axiosI.post(`/training/${router.query.id}/exercise/add`, exercise);

        // For now just wait 1 second and set loadNewExercise to true then false
        // Just for implementing the skeleton loading
        setLoadNewExercise(true);
        console.log(JSON.stringify(training));
        setTimeout(() => {
            setLoadNewExercise(false);
        }, 2000);
    };

    const addEmptyExerciseEvent = () => {
        setLoadNewExercise(true);
        addEmptyExerciseEventToTraining(training.id)
            .then(() => {
                loadTrainings();
            })
            .finally(() => {
                setLoadNewExercise(false);
            });
    };

    return (
        <div className="flex flex-col items-center ">
            <div className="flex w-5/6 flex-col gap-4">
                {router.query.id}
                <br />
                {training?.startDateTime && format(new Date(training.startDateTime), "dd.MM.yyyy HH:mm")}
                {training?.startDateTime && (
                    <PassedTime
                        startTime={new Date(training.startDateTime)}
                        endDateTime={training.endDateTime && new Date(training.endDateTime)}
                    />
                )}

                {/* Add-Button */}
                <div className="flex items-center justify-center">
                    {trainingActive && (
                        <Button variant="big" onClick={addEmptyExerciseEvent} isLoading={loadNewExercise}>
                            <div className="flex items-center justify-center gap-2">
                                <AddIcon boxSize={"4"} />
                                Add Exercise
                            </div>
                        </Button>
                    )}
                </div>

                {loadNewExercise && <ExerciseSkeleton />}
                {training.exerciseEvents?.map((exerciseEvent) => {
                    return (
                        <ExerciseEventComponent
                            key={exerciseEvent.id}
                            exerciseEvent={exerciseEvent}
                            onClick={() => router.push("/trainings/exercises/" + exerciseEvent.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function ExerciseSkeleton() {
    return <Skeleton className="h-24 w-full" rounded={10}></Skeleton>;
}

function PassedTime({ startTime, endDateTime }: { startTime: Date; endDateTime?: Date }) {
    const [passedTime, setPassedTime] = useState<any>();
    const start = useMemo(() => startTime, [startTime]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (endDateTime) {
            let difference = differenceInSeconds(endDateTime, start);
            setPassedTime(
                `${Math.floor(difference / 3600)
                    .toString()
                    .padStart(2, "0")}:${Math.floor((difference / 60) % 60)
                    .toString()
                    .padStart(2, "0")}:${(difference % 60).toString().padStart(2, "0")}`
            );
            setIsLoading(false);
            return;
        }
        const interval = setInterval(() => {
            let difference = differenceInSeconds(Date.now(), start);
            setPassedTime(
                `${Math.floor(difference / 3600)
                    .toString()
                    .padStart(2, "0")}:${Math.floor((difference / 60) % 60)
                    .toString()
                    .padStart(2, "0")}:${(difference % 60).toString().padStart(2, "0")}`
            );
            setIsLoading(false);
        }, 1000);

        return () => clearInterval(interval);
    }, [endDateTime, start]);

    return (
        <div className="flex items-center justify-center gap-2">
            <TimeIcon height={6} width={6} />
            {isLoading ? (
                <Skeleton>
                    <span className="py-1 font-mono text-xl font-medium">00:00:00</span>
                </Skeleton>
            ) : (
                <span className="py-1 text-xl font-medium">{passedTime}</span>
            )}
        </div>
    );
}
