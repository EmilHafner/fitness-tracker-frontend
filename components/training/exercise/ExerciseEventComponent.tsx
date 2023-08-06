import { ExerciseEvent } from "@/pages/trainings/[id]";
import { useRouter } from "next/router";

export default function ExerciseEventComponent(props: { exerciseEvent: ExerciseEvent } & { onClick: () => void }) {
    const { id, exerciseType, trainingsSets } = props.exerciseEvent;
    const router = useRouter();

    const sets = trainingsSets || [];


    return (
        <div
            className="flex w-full flex-col justify-between rounded-lg border-2 bg-stone-50 px-4 py-2 md:px-16 text-sm font-medium hover:cursor-pointer hover:border-accent hover:shadow-lg md:text-base"
            onClick={props.onClick}
        >
            <div className="text-base">
                {exerciseType?.name ? <div>{exerciseType.name}</div> : <div>No exercise type selected</div>}
            </div>
            <div className="flex flex-col text-sm text-stone-700 w-3/5">
                <div className="flex flex-row justify-between">
                    <span>Nr.</span> <span>Weight x Reps</span>
                </div>
                {sets.map((set, index) => {
                    return (
                        <div key={index} className="flex flex-row justify-between text-stone-600 font-normal">
                            <span>{set.orderNumber}.</span><span>{set.weight} kg x {set.reps}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
