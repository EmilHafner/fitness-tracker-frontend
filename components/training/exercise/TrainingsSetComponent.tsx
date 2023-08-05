import Button from "@/components/basics/Button";
import { DeleteIcon } from "@chakra-ui/icons";
import { Checkbox, Input, InputGroup } from "@chakra-ui/react";
import { Set } from "global-types";

export default function TrainingsSetComponent(props: { set: Set }) {
    const { weight, reps } = props.set;

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
                        <Button className="bg-abort p-2 hover:bg-abort-muted">
                            <div className="flex items-center justify-center rounded-sm ">
                                <DeleteIcon />
                            </div>
                        </Button>
                    </div>

                    <div className="flex w-full flex-row items-center gap-6">
                        <div>
                            <span className="font-medium text-stone-800">Reps</span>
                            <InputGroup>
                                Reps
                                <Input value={reps} />
                            </InputGroup>
                        </div>
                        <div>
                            <span className="font-medium text-stone-800">Weight</span>
                            <InputGroup>
                                <Input value={weight} />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
