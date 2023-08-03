import { Checkbox, Input } from "@chakra-ui/react";
import { Set } from "global-types";

export default function TrainingsSetComponent(props: { set: Omit<Set, "orderNumber" | "id"> }) {
    const { weight, reps } = props.set;

    return (
        <div>
            <div className="flex min-h-fit w-full items-center justify-center gap-4 outline outline-1 bg-accent">
                <div className="m-1 flex w-full flex-row items-center justify-between gap-4">
                    <Checkbox checked={false} />
                    <Input value={reps} className="bg-white"/>
                    <Input value={weight} />
                </div>
            </div>
        </div>
    );
}
