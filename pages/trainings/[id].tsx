import { axiosI } from "@/services/axiosInstance";
import { AddIcon, TimeIcon } from "@chakra-ui/icons";
import { Skeleton, useToast } from "@chakra-ui/react";
import {
    differenceInMilliseconds,
    differenceInSeconds,
    format,
    formatDistanceToNow,
    formatDistanceToNowStrict,
    getMilliseconds,
} from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getExercisesByTrainingId, getTrainingById } from "@/services/axiosInstance";
import { errorToast } from "@/utils/standardToasts";

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
    endDateTime: Date;
    exerciseEvents?: Array<ExerciseEvent>;
}

export default function Training() {
    const router = useRouter();
    const [training, setTraining] = useState({} as Training);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const [loadNewExercise, setLoadNewExercise] = useState(false);
    const [trainingActive, setTrainingActive] = useState(false);

    // Load training on first render
    useEffect(() => {
        setIsLoading(true);
        if (!router.query.id) return; // Make sure that no call is mady without a training-id
        getTrainingById(parseInt(router.query.id as string)).then((res) => {
            setTraining(res.data);
            setTrainingActive(res.data && !res.data.endDateTime);
        }).catch((e) => {
            toast(errorToast("An Error occured", e.message));
        }).finally(() => {
            setIsLoading(false);
        });
        
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
                {training?.startDateTime && <PassedTime startTime={new Date(training.startDateTime)} />}

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

// TODO: Account for Time Zones
// ! Currently time difference is 3 hours less than it should be
function PassedTime({ startTime, endDateTime }: { startTime: Date, endDateTime?: Date }) {
    const [passedMinutes, setPassedMinutes] = useState<any>();
    const start = useMemo(() => startTime, [startTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPassedMinutes(format(new Date() - start, "mm:ss"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <TimeIcon /> {passedMinutes}
        </div>
    );
}
