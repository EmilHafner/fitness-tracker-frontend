import { useExerciseTypes } from "@/hooks/useExerciseTypes";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Collapse, Input, InputGroup, InputRightElement, useDisclosure, useOutsideClick } from "@chakra-ui/react";
import { ExerciseType } from "global-types";
import React from "react";


export default function SelectExerciseType({ initialType, exerciseId }: { initialType?: string; exerciseId?: string }) {
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
                <Input placeholder="Select Exercise Type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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