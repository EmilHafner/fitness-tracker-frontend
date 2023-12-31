import { addEmptyExerciseEventToTraining, stopTraining } from "@/services/axiosInstance";
import { AddIcon, CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { Skeleton, useToast } from "@chakra-ui/react";
import { differenceInSeconds, format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getTrainingById } from "@/services/axiosInstance";
import { errorToast } from "@/utils/standardToasts";
import Button from "@/components/basics/Button";
import ExerciseEventComponent from "@/components/training/exercise/ExerciseEventComponent";
import { useExerciseEvents } from "@/hooks/useExerciseEvents";
import { Set } from "global-types";

interface ExerciseType {
    id: number;
    name: string;
    bodypart?: string;
}

export interface ExerciseEvent {
    id: number;
    exerciseType: ExerciseType;
    trainingsSets?: Array<Set>;
    orderNumber: number;
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
    const { exerciseEvents } = useExerciseEvents(parseInt(router.query.id as string));
    const [stopping, setStopping] = useState(false);

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

    const addEmptyExerciseEvent = () => {
        setLoadNewExercise(true);
        addEmptyExerciseEventToTraining(training.id)
            .then((res) => {
                router.push("/trainings/" + training.id + "/exercises/" + res.data.id);
                loadTrainings();
            })
            .finally(() => {
                setLoadNewExercise(false);
            });
    };

    const stopThisTraining = () => {
        setStopping(true);
        stopTraining(training.id).then(() => {
            loadTrainings();
        }).catch((err) => {
            toast(errorToast("An Error occured", err.message));
        }).finally(() => {
            setStopping(false);
        })
    };

    return (
        <div className="flex flex-col items-center ">
            <div className="flex w-5/6 flex-col gap-4 pb-6">
                <span className="text-2xl font-bold text-stone-800">
                    {training?.startDateTime && format(new Date(training.startDateTime), "dd. MMM, yyyy HH:mm")}
                </span>
                {training?.startDateTime && (
                    <PassedTime
                        startTime={new Date(training.startDateTime)}
                        endDateTime={training.endDateTime && new Date(training.endDateTime)}
                    />
                )}

                {/* Add-Button */}
                {trainingActive && (
                    <div className="flex items-center justify-center gap-10">
                        <Button variant="big" onClick={addEmptyExerciseEvent} isLoading={loadNewExercise}>
                            <div className="flex items-center justify-center gap-2">
                                <AddIcon boxSize={"4"} />
                                Add Exercise
                            </div>
                        </Button>

                        <Button variant="big" onClick={stopThisTraining} isLoading={stopping}>
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircleIcon height={6} width={6} />
                                Stop training
                            </div>
                        </Button>
                    </div>
                )}

                {loadNewExercise && <ExerciseSkeleton />}
                {exerciseEvents.map((exerciseEvent) => {
                    return (
                        <ExerciseEventComponent
                            key={exerciseEvent.id}
                            exerciseEvent={exerciseEvent}
                            onClick={() => router.push("/trainings/" + training.id + "/exercises/" + exerciseEvent.id)}
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
                <span className="w-20 py-1 text-center text-xl font-medium">{passedTime}</span>
            )}
        </div>
    );
}
