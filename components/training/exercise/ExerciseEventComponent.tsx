import { ExerciseEvent } from "@/pages/trainings/[id]";
import { Divider } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ExerciseEventComponent(props: { exerciseEvent: ExerciseEvent } & { onClick: () => void }) {
    const { id, exerciseType, sets } = props.exerciseEvent;
    const router = useRouter();

    return (
        <div
            className="flex h-24 w-full flex-row items-center justify-center rounded-lg bg-slate-300 text-lg font-medium shadow-lg hover:cursor-pointer hover:bg-slate-200"
            onClick={props.onClick}
        >
            {exerciseType?.name ? <div>{exerciseType.name}</div> : <div>No exercise type selected</div>}
        </div>
    );
}
