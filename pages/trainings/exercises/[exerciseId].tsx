import { searchExerciseTypesByName } from "@/services/axiosInstance";
import { Select } from "@chakra-ui/react";
import { ExerciseType } from "global-types";
import { useRouter } from "next/router";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        searchExerciseTypesByName(searchTerm).then((res) => {
            setExerciseTypes(res.data);
        });
    }, [searchTerm]);

    return (
        <div>
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Select>
                {exerciseTypes?.map((type) => {
                    return (
                        <option value={type.id} key={type.id}>
                            {type.name}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
}
