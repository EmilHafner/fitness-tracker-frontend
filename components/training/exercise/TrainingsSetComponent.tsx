import Button from "@/components/basics/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { deleteTrainingsSet, updateSet } from "@/services/axiosInstance";
import { DeleteIcon } from "@chakra-ui/icons";
import {
    Checkbox,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Set } from "global-types";
import { useEffect, useState } from "react";

export default function TrainingsSetComponent(props: { set: Set }) {
    const [set, setSet] = useState<Set>(props.set);
    const queryClient = useQueryClient();
    const deleteTrainingsSetMutation = useMutation({
        mutationFn: deleteTrainingsSet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sets"] });
        },
    });
    const { debouncedValue: debouncedSet } = useDebounce(set, 700);
    

    
    const updateTrainingsSetMutation = useMutation({
        mutationFn: updateSet,
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["sets"] });
        },
    });

    // This is needed in order for the useEffect to work. Otherwise we would get an infinite loop
    const {mutate: mutateTrainingsSets} = updateTrainingsSetMutation;

    useEffect(() => {
        mutateTrainingsSets({
            setId: debouncedSet.id,
            weight: debouncedSet.weight,
            reps: debouncedSet.reps,
        })
    }, [debouncedSet, mutateTrainingsSets]);



    return (
        <div className="card border-2 bg-stone-50">
            <div className="card-body">
                <div>
                    <div className="flex justify-between">
                        <div className="card-actions justify-end">
                            <div className="flex items-center gap-2">
                                <Checkbox checked={false} colorScheme="green" />
                                <span className={"font-medium"}>Warm up</span>
                            </div>
                        </div>
                        <Button
                            className="border bg-stone-50 p-2 shadow-none hover:bg-abort hover:bg-opacity-50"
                            onClick={() => deleteTrainingsSetMutation.mutate(set.id)}
                        >
                            <div className="flex items-center justify-center rounded-sm ">
                                <DeleteIcon />
                            </div>
                        </Button>
                    </div>

                    <div className="flex w-full flex-row items-center gap-6">
                        <div>
                            <span className="font-medium text-stone-800">Weight</span>
                            <NumberInput
                                value={set.weight}
                                onChange={(value) => {
                                    let weight = value ? parseInt(value) : "";
                                    setSet({ ...set, weight: weight });
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </div>
                        <div>
                            <span className="font-medium text-stone-800">Reps</span>
                            <NumberInput
                                value={set.reps}
                                onChange={(value) => {
                                    let reps = value ? parseInt(value) : "";
                                    setSet({ ...set, reps: reps });
                                }}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
