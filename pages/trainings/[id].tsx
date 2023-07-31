import { axiosI } from "@/services/axiosInstance";
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

interface ExerciseEvent {
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
    const [exerciseEvents, setExerciseEvents] = useState({} as ExerciseEvent[]);

    // Load training from API
    const loadTraining = useCallback(() => {
        return axiosI
            .get(`/training/${router.query.id}`)
            .then((res) => {
                setTraining(res.data);
            })
            .catch((e) => {
                console.log(e);
                toast({
                    title: "An Error occured",
                    description: e.message,
                    status: "error",
                    variant: "left-accent",
                    duration: 4000,
                    isClosable: true,
                });
            });
    }, [router.query.id, toast]);

    const loadExerciseEvents = useCallback(() => {
        return axiosI
            .get(`/training/${router.query.id}/exercises`)
            .then((res) => {
                setExerciseEvents(res.data);
            })
            .catch((e) => {
                console.log(e);
                toast({
                    title: "An Error occured",
                    description: e.message,
                    status: "error",
                    variant: "left-accent",
                    duration: 4000,
                    isClosable: true,
                });
            });
    }, [router.query.id, toast]);

    // Load training on first render
    useEffect(() => {
        setIsLoading(true);
        if (!router.query.id) return; // Make sure that no call is mady without a training-id
        loadTraining().then(() => {
            setIsLoading(false);
            setTrainingActive(training && !training.endDateTime);
        });
        loadExerciseEvents();
    }, [router, toast]);

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

                {trainingActive && <AddExerciseComponent onClick={addOrUpdateExerciseInTraining} />}
                {loadNewExercise && <ExerciseSkeleton />}
                {training.exerciseEvents?.map((exerciseEvent) => {
                    return <ExerciseComponent key={exerciseEvent.id} exerciseEvent={exerciseEvent} />;
                })}
            </div>
        </div>
    );
}

function AddExerciseComponent({ onClick }: { onClick: () => void }) {
    return (
        <button
            className="flex h-24 w-full flex-col items-center justify-center
    rounded-xl shadow-lg  outline outline-1 outline-slate-300 hover:bg-slate-200"
            onClick={onClick}
        >
            <AddIcon boxSize={"6"} className="" />
            Add Exercise
        </button>
    );
}

function ExerciseComponent(props: { exerciseEvent: ExerciseEvent }) {
    return (
        <div className=" flex h-24 w-full flex-row items-center justify-center rounded-lg bg-slate-50 shadow-lg">
            {props.exerciseEvent.exerciseType.name}
        </div>
    );
}

function ExerciseSkeleton() {
    return <Skeleton className="h-24 w-full" rounded={10}></Skeleton>;
}

function PassedTime({ startTime, endDateTime }: { startTime: Date; endDateTime?: Date }) {
    const [passedTime, setPassedTime] = useState<any>();
    const start = useMemo(() => startTime, [startTime]);

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
        }, 1000);
        return () => clearInterval(interval);
    }, [endDateTime, start]);

    return (
        <div className="flex items-center justify-center gap-2">
            <TimeIcon height={6} width={6} />
            <span className="py-1 text-xl font-medium">{passedTime}</span>
        </div>
    );
}
