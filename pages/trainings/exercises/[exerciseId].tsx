import { getExerciseEventById } from "@/services/axiosInstance";
import {
    Collapse,
    Fade,
    InputGroup,
    InputRightElement,
    Select,
    SlideFade,
    useDisclosure,
    useOutsideClick,
} from "@chakra-ui/react";
import { ExerciseType } from "global-types";
import { useRouter } from "next/router";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { ExerciseEvent } from "../[id]";
import { useSets } from "@/hooks/useSets";
import Button from "@/components/basics/Button";
import { useExerciseTypes } from "@/hooks/useExerciseTypes";
import LoadingPage from "@/components/loading/LoadingPage";
import TrainingsSetComponent from "@/components/training/exercise/TrainingsSetComponent";
import { AddIcon, CheckCircleIcon, ChevronDownIcon } from "@chakra-ui/icons";

export default function Exercise() {
    const router = useRouter();
    const [exerciseEvent, setExerciseEvent] = useState<ExerciseEvent>({} as ExerciseEvent);
    const { sets, addSet, updateSets, setsLoading } = useSets(parseInt(router.query?.exerciseId as string));
    const [exerciseEventLoading, setExerciseEventLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<boolean>(false);

    useEffect(() => {
        setExerciseEventLoading(true);
        getExerciseEventById(parseInt(router.query?.exerciseId as string))
            .then((res) => {
                setExerciseEvent(res.data);
                if (!res.data) {
                    setLoadingError(true);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setExerciseEventLoading(false);
            });
    }, [router]);

    if (exerciseEventLoading) {
        return <LoadingPage />;
    }

    if (loadingError) {
        return <div>Exercise not found</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-5/6">
                {exerciseEvent.id}
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="relative z-10 w-3/5 max-w-md py-4">
                        <SelectExerciseType
                            initialType={exerciseEvent.exerciseType?.name}
                            exerciseId={router.query?.exerciseId as string}
                        />
                    </div>
                    <Button className="bg-blue-400 hover:bg-blue-300 max-w-sm w-2/5">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon />
                            <span className="font-medium">Complete</span>
                        </div>
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {sets.map((set) => {
                        return <TrainingsSetComponent key={set.id} set={set} />;
                    })}
                </div>

                <div className="relative flex justify-center p-4">
                    <Button
                        variant="big"
                        onClick={() => {
                            addSet({ reps: 5, weight: 5 });
                        }}
                    >
                        <AddIcon boxSize={"4"} />
                        Add set
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SelectExerciseType({ initialType, exerciseId }: { initialType?: string; exerciseId?: string }) {
    const { exerciseTypes, updateExerciseTypes, exerciseTypesLoading, saveExerciseType, searchTerm, setSearchTerm } =
        useExerciseTypes(initialType);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick({
        ref: ref,
        handler: () => {
            if (!isOpen) return;
            onClose();
            setExerciseType(searchTerm);
        },
    });

    const setExerciseType = (exerciseTypeName: string) => {
        if (!exerciseId) return;
        if (!exerciseTypes) {
            setTimeout(() => "", 1000);
        }
        if (!exerciseTypes) return;
        const typeId = exerciseTypes.find((type) => type.name === exerciseTypeName)?.id;
        if (!typeId) return;

        saveExerciseType(parseInt(exerciseId), typeId);
    };

    const setOption = (option: string) => {
        setSearchTerm(option);
        onClose();
        setExerciseType(option);
    };

    return (
        <div ref={ref} className="relative w-full">
            <InputGroup onClick={onOpen}>
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <InputRightElement>
                    <ChevronDownIcon width={6} height={6} />
                </InputRightElement>
            </InputGroup>
            <div className="absolute w-full">
                <Collapse in={isOpen}>
                    <div className="flex flex-col items-start bg-white">
                        {exerciseTypes?.map((type) => {
                            return <ExerciseTypeOption type={type} key={type.id} setOption={setOption} />;
                        })}
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

function ExerciseTypeOption({ type, setOption }: { type: ExerciseType; setOption: Function }) {
    return (
        <button
            className="z-10 h-10 w-full rounded p-2 outline outline-1 -outline-offset-2 outline-gray-200 hover:bg-blue-100 focus:outline-2 focus:outline-blue-400"
            onClick={() => setOption(type.name)}
        >
            {type.name}
        </button>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session?.user) {
        return {
            redirect: {
                destination: "/auth/login?callbackUrl=/trainings&error=notLoggedIn",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
