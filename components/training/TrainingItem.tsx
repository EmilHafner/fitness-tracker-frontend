import { useBoolean } from "@chakra-ui/hooks";
import { format, differenceInDays, intervalToDuration, formatDuration } from "date-fns";
import { useRouter } from "next/router";
import { stopTraining } from "@/services/axiosInstance";
import { ExerciseEvent } from "@/pages/trainings/[id]";
import { useEffect, useState } from "react";

export interface TrainingItemInterface {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    exerciseEvents: ExerciseEvent[];
}

export default function TrainingItem(props: TrainingItemInterface & { reloadItems: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useBoolean();

    const start: Date = new Date(props.startDateTime);
    const end: Date | null = props.endDateTime ? new Date(props.endDateTime) : null;
    const { exerciseEvents } = props;
    const [sortedExerciseEvents, setSortedExerciseEvents] = useState<ExerciseEvent[]>([]);
    const active = !end;

    // TODO: Add Icons for records
    // TODO: Add delete and edit button
    // TODO: Handle mutliple days differently
    // TODO: Highlight Trainings which are not completed. And add complete-Button to them

    useEffect(() => {
        if (!exerciseEvents) return;
        let sorted = exerciseEvents.sort((a, b) => a.orderNumber - b.orderNumber);
        setSortedExerciseEvents(sorted);
    }, [exerciseEvents])

    const getStartDateString = (): string => {
        return format(start, "MMMM do");
    };

    const getDurationString = (): string => {
        if (!end) return "";

        let d = intervalToDuration({
            start: start,
            end: end,
        });

        return `${d.hours}h ${d.minutes}m`;
    };

    const onClick = () => {
        router.push("trainings/" + props.id);
    };

    const getTitle = (): string => {
        if (!end) {
            return "Active Training";
        } else {
            // Different title for time of day (morning, afternoon, evening)
            let hour = start.getHours();
            if (hour < 12) {
                return "Morning Training";
            } else if (hour < 18) {
                return "Afternoon Training";
            } else {
                return "Evening Training";
            }
        }
    };

    const getAverageSet = (exerciseEvents: ExerciseEvent[]): string => {
        let repsSum = 0;
        let weightSum = 0;
        let count = 0;
        exerciseEvents.forEach((exerciseEvent) => {
            if (!exerciseEvent.trainingsSets) return;
            exerciseEvent.trainingsSets.forEach((set) => {
                repsSum += set.reps as number;
                weightSum += set.weight as number;
                count++;
            });
        });
        if (count === 0) return "0.0 kg x 0.0";
        let avgReps = repsSum / count;
        let avgWeight = weightSum / count;
        if (!avgReps) return "0.0 kg x 0.0";
        return `${avgWeight.toFixed(1)} kg x ${avgReps.toFixed(1)}`;
    };

    return (
        <div
            onClick={onClick}
            className={
                "flex h-full w-5/6 bg-stone-50 rounded-xl border-2 px-8 py-4 shadow-sm hover:cursor-pointer hover:border-accent hover:shadow-lg md:px-16"
            }
        >
            <div className={"mr-2 w-2 rounded-md " + (active ? "bg-primary" : "bg-accent")}></div>
            <div className="flex w-full flex-col">
                {/* Data from the training */}
                <div className={"flex w-full justify-between"}>
                    <div className="flex">
                        <div className={"flex flex-col justify-between"}>
                            <div className={"flex flex-col pb-1"}>
                                {/* Startdate and Duration */}
                                <span className={"text-sm font-bold text-stone-800 md:text-lg"}>{getTitle()}</span>
                                <span className={"text-sm text-stone-600"}>{getStartDateString()}</span>
                                {/* <span className="text-sm text-stone-800">{getTimeFromTo()}</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="text-sm font-medium text-stone-800">{getDurationString()}</div>
                    </div>
                </div>
                <div className="py-2">{/* Divider */}</div>
                <div className="flex w-4/5 sm:w-52 flex-col text-xs text-stone-600 md:w-56 md:text-sm">
                    <div className="flex justify-between font-bold">
                        <span>Exercise</span>
                        <span>Avg. Set</span>
                    </div>
                    {exerciseEvents.sort((a,b) => a.orderNumber - b.orderNumber).map((exerciseEvent) => {
                        if (!exerciseEvent.exerciseType || !exerciseEvent.trainingsSets) return null;
                        return (
                            <div key={exerciseEvent.id} className="flex justify-between">
                                <span>{exerciseEvent.exerciseType?.name}</span>
                                <span>{getAverageSet([exerciseEvent])}</span>
                            </div>
                        );
                     })}
                </div>
            </div>
        </div>
    );
}
