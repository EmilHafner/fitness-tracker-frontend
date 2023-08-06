import Button from "@/components/basics/Button";
import { DeleteIcon } from "@chakra-ui/icons";
import { Checkbox, Input, InputGroup } from "@chakra-ui/react";
import { Set } from "global-types";
import { useCallback, useEffect, useState } from "react";

export default function TrainingsSetComponent(props: { set: Set; changeSetLocally: (set: Set) => void }) {
    const [set, setSet] = useState<Set>(props.set);
    const { changeSetLocally } = props;

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
                        <Button className="border bg-stone-50 p-2 shadow-none hover:bg-abort hover:bg-opacity-50">
                            <div className="flex items-center justify-center rounded-sm ">
                                <DeleteIcon />
                            </div>
                        </Button>
                    </div>

                    <div className="flex w-full flex-row items-center gap-6">
                        <div>
                            <span className="font-medium text-stone-800">Weight</span>
                            <InputGroup>
                                <Input
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) => {
                                        let weight = e.target.value ? parseInt(e.target.value) : "";
                                        setSet({ ...set, weight: weight });
                                        changeSetLocally({ ...set, weight: weight });
                                    }}
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <span className="font-medium text-stone-800">Reps</span>
                            <InputGroup>
                                Reps
                                <Input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => {
                                        let reps = e.target.value ? parseInt(e.target.value) : "";
                                        setSet({ ...set, reps: reps });
                                        changeSetLocally({ ...set, reps: reps });
                                    }}
                                />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
