import { ExerciseEvent } from "@/pages/trainings/[id]";

export default function ExerciseEventComponent(props: { exerciseEvent: ExerciseEvent }) {
    return (
        <div className=" flex h-24 w-full flex-row items-center justify-center rounded-lg bg-slate-50 shadow-lg">
            {props.exerciseEvent.exerciseType?.name}
        </div>
    );
}
