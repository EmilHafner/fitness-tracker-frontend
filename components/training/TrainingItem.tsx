import { useBoolean } from "@chakra-ui/hooks";
import { format, differenceInDays, intervalToDuration, formatDuration } from "date-fns";
import { useRouter } from "next/router";
import { stopTraining } from "@/services/axiosInstance";

export interface TrainingItemInterface {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
}

export default function TrainingItem(props: TrainingItemInterface & { reloadItems: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useBoolean();

    const start: Date = new Date(props.startDateTime);
    const end: Date | null = props.endDateTime ? new Date(props.endDateTime) : null;
    const active = !end;

    // TODO: Add Icons for records
    // TODO: Add delete and edit button
    // TODO: Handle mutliple days differently
    // TODO: Highlight Trainings which are not completed. And add complete-Button to them

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

    const getTimeFromTo = (): string => {
        if (!end) {
            return format(start, "HH:mm");
        }
        if (differenceInDays(end, start) > 1) {
            return format(start, "HH:mm") + " to " + format(end, "HH:mm '(different day: ' dd.MM.yyyy')'");
        }
        return format(start, "HH:mm") + " to " + format(end, "HH:mm");
    };

    const onClick = () => {
        router.push("trainings/" + props.id);
    };

    const stopThisTraining = (e: React.MouseEvent<any>) => {
        setLoading.on();
        e.stopPropagation();
        stopTraining(props.id).then(() => props.reloadItems());
        setLoading.off();
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
                    <div className="flex justify-between">
                        <span>Exercise name is long</span>
                        <span>25 kg x 12</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Exercise name</span>
                        <span>25 kg x 12</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Exercise name</span>
                        <span>25 kg x 12</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Exercise name</span>
                        <span>25 kg x 12</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Exercise name</span>
                        <span>25 kg x 12</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Exercise name</span>
                        <span>25 kg x 12</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
