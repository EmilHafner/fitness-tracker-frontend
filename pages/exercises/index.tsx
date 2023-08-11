import Button from "@/components/basics/Button";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Select,
    InputGroup,
    useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useState } from "react";
import {
    deleteExerciseType,
    getAllBodyparts,
    getAllExerciseTypes,
    saveExerciseType,
    searchExerciseTypesByName,
} from "@/services/axiosInstance";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "@/components/loading/LoadingPage";
import { errorToast } from "@/utils/standardToasts";
import { ExerciseType } from "global-types";

interface Exercise {
    id?: number;
    name: string;
    bodypart: string;
}

export default function Exercises() {
    const { isOpen: modalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const [exerciseToSave, setExerciseToSave] = useState({} as Exercise);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast();

    const queryClient = useQueryClient();

    const loadAllBodypartsQuery = useQuery({
        queryKey: ["bodyparts"],
        queryFn: () => getAllBodyparts(),
    });

    const loadAllExerciseTypesQuery = useQuery({
        queryKey: ["exercises"],
        queryFn: getAllExerciseTypes,
    });

    const searchExerciseTypesByNameQuery = useQuery({
        queryKey: ["searchExercises"],
        queryFn: () => searchExerciseTypesByName,
    });

    const saveExerciseTypeMutation = useMutation({
        mutationFn: saveExerciseType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exercises"] });
            onModalClose();
            setExerciseToSave({} as { name: string; bodypart: string });
        },
        onError: () => {
            toast(errorToast("Error", "Could not save Exercise Type"));
        },
    });

    const deleteExerciseTypeMutation = useMutation({
        mutationFn: deleteExerciseType,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
    });

    const sortExerciseTypes = (exerciseTypes: ExerciseType[]) => {
        return exerciseTypes.sort((a, b) => a.name.localeCompare(b.name));
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setExerciseToSave({} as { name: string; bodypart: string });
        onModalClose();
    };

    // LoadingPage
    if (loadAllExerciseTypesQuery.isLoading) return <LoadingPage />;

    return (
        <div>
            <div className="flex w-full justify-center">
                <div className="flex w-5/6 flex-col gap-2 py-4">
                    {/* List of all exercises */}
                    {sortExerciseTypes(loadAllExerciseTypesQuery.data?.data).map((v: any) => {
                        return (
                            <div
                                key={v.id}
                                className="mb-2 flex flex-row items-center justify-between rounded-xl border bg-stone-100 px-8 py-4 hover:border-accent"
                            >
                                <div className="flex flex-col gap-2">
                                    <h1 className="font-medium">{v.name}</h1>
                                    <p className="text-sm text-gray-500">{v.bodypart}</p>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <Button
                                        variant="normal"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setExerciseToSave(v);
                                            onModalOpen();
                                        }}
                                    >
                                        <div className="flex items-center justify-center p-1">
                                            <EditIcon />
                                        </div>
                                    </Button>
                                    <Button
                                        variant="normal"
                                        className="bg-abort hover:bg-abort-muted"
                                        onClick={() => deleteExerciseTypeMutation.mutate(v.id)}
                                        isLoading={deleteExerciseTypeMutation.variables === v.id}
                                    >
                                        <div className="flex items-center justify-center p-1">
                                            <DeleteIcon />
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Button to add a new exercise (opens a Modal) */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
                <Button variant="big" onClick={onModalOpen}>
                    Add Exercise
                </Button>

                <Modal isOpen={modalOpen} isCentered={true} onClose={onModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{isEditing ? "Edit exercise" : "New exercise"}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h1 className="pb-2 font-medium">Exercise name</h1>
                                    <InputGroup>
                                        <Input
                                            placeholder="Exercise Name"
                                            value={exerciseToSave.name}
                                            onChange={(e) =>
                                                setExerciseToSave({
                                                    ...exerciseToSave,
                                                    ["name"]: e.target.value,
                                                })
                                            }
                                        />
                                    </InputGroup>
                                </div>
                                <div>
                                    <h1 className="pb-2 font-medium">Main body part</h1>
                                    <Select
                                        value={exerciseToSave.bodypart}
                                        onChange={(e) =>
                                            setExerciseToSave({
                                                ...exerciseToSave,
                                                ["bodypart"]: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Null">Not selected</option>
                                        {loadAllBodypartsQuery.data?.data.map((v: any) => {
                                            return (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            );
                                        })}
                                    </Select>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <div className="flex flex-row gap-4">
                                <Button className="bg-slate-200 hover:bg-slate-300" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                                <Button
                                    isLoading={saveExerciseTypeMutation.isLoading}
                                    disabled={saveExerciseTypeMutation.isLoading}
                                    onClick={() => saveExerciseTypeMutation.mutate(exerciseToSave)}
                                >
                                    {isEditing ? "Save" : "Create"}
                                </Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session?.user) {
        return {
            redirect: {
                destination: "/auth/login?callbackUrl=/exercises&error=notLoggedIn",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
