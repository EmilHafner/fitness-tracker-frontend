import { saveTraining } from "@/services/axiosInstance";
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { format } from "date-fns";
import Button from "../basics/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddTrainingComponent() {
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const toast = useToast();

    const saveTrainingMutation = useMutation({
        mutationFn: saveTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trainings"] });
            toast({
                title: "Added a training",
                variant: "left-accent",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        },
        onError: () => {
            toast({
                title: "Error",
                variant: "left-accent",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSettled(data, error, variables, context) {
            onClose();
        },
    });
    // TODO: Get all plans from backend
    // TODO: Implement setting a custom startdate

    const openModal = () => {
        setStartDate(format(new Date(), "yyyy-MM-dd"));
        setStartTime(format(new Date(), "HH:mm"));
        onOpen();
    };

    return (
        <div>
            <div className={"fixed bottom-20 left-1/2 -translate-x-1/2 font-medium"}>
                <Button variant="big" className={""} onClick={openModal}>
                    Start new Training
                </Button>
            </div>
            <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start new Training</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <h2 className={"text-lg font-medium"}>Choose a plan</h2>
                        <div className="pb-6 pt-2">
                            <Select placeholder="No plan">
                                <option value="Option 1">Option 1</option>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row items-center justify-between">
                                <h3 className={"text-md font-medium"}>Enter Date and time</h3>
                            </div>

                            <div className="flex flex-row gap-4">
                                <div className="flex w-full justify-between gap-2">
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            className="mr-4 rounded-lg bg-white px-4 py-2 font-medium hover:bg-gray-100"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="rounded-lg bg-accent px-4 py-2 font-medium hover:bg-accent-muted"
                            onClick={() => saveTrainingMutation.mutate(new Date(startDate + "T" + startTime + ":00"))}
                        >
                            Create
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
