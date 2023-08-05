import Button from "@/components/basics/Button";
import { DeleteIcon } from "@chakra-ui/icons";
import { Checkbox, Input, InputGroup } from "@chakra-ui/react";
import { Set } from "global-types";

export default function TrainingsSetComponent(props: { set: Set }) {
    const { weight, reps, orderNumber } = props.set;

    return (
        <div className="card bg-stone-100 shadow-xl">
            <div className="card-body">
                <div>
                    <div className="flex justify-between">
                        <div className="card-actions justify-end">
                            <div className="flex items-center gap-2">
                                <Checkbox checked={false} />
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
                            Reps
                            <InputGroup>
                                Reps
                                <Input value={reps} />
                            </InputGroup>
                        </div>
                        <div>
                            Weight
                            <InputGroup>
                                <Input value={weight} />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-row items-center justify-between gap-2 rounded-lg bg-stone-100 px-6 py-2 shadow-md">
            <div className="flex flex-col items-center justify-between gap-2 rounded-lg">
                <div className="flex w-full items-center justify-between">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full outline outline-1 outline-offset-2">
                        {orderNumber}
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox checked={false} />
                        <span className={"font-medium"}>Warm up</span>
                    </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between gap-6">
                    <div>
                        Reps
                        <InputGroup>
                            Reps
                            <Input value={reps} />
                        </InputGroup>
                    </div>
                    <div>
                        Weight
                        <InputGroup>
                            <Input value={weight} />
                        </InputGroup>
                    </div>
                </div>
            </div>
            <Button className="bg-abort p-2 hover:bg-abort-muted">
                <div className="flex items-center justify-center rounded-sm ">
                    <DeleteIcon />
                </div>
            </Button>
        </div>
    );

    return (
        <div>
            <div className="flex min-h-fit w-full items-center justify-center gap-4 bg-accent outline outline-1">
                <div className="m-1 flex w-full flex-row items-center justify-between gap-4">
                    <Input value={reps} className="bg-white" />
                    <Input value={weight} />
                </div>
            </div>
        </div>
    );
}
