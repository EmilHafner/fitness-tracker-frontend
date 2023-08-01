import { Select } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Exercise() {
    const router = useRouter();

    return (
        <div>
            {router.query?.exerciseId}
            <SelectExerciseType />
        </div>
    );
}

function SelectExerciseType() {
    return <Select></Select>;
}
