import { addSetToExerciseEvent, getSetsByExerciseId } from "@/services/axiosInstance";
import { useRouter } from "next/router";
import React from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Button from "@/components/basics/Button";
import LoadingPage from "@/components/loading/LoadingPage";
import TrainingsSetComponent from "@/components/training/exercise/TrainingsSetComponent";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import SelectExerciseType from "@/components/training/exercise/SelectExerciseType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Set } from "global-types";

export default function Exercise() {
    const router = useRouter();
    //const { sets, addSet, saveSets, changeSetLocally } = useSets(parseInt(router.query?.exerciseId as string));

    const queryClient = useQueryClient();

    const loadSetsQuery = useQuery({
        queryKey: ["sets", router.query.id],
        enabled: router?.isReady,
        queryFn: () => getSetsByExerciseId(router.query.exerciseId),
    });

    const addSetMutation = useMutation({
        mutationFn: addSetToExerciseEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sets"] });
        },
    });

    const sortSets = (sets: Set[]) => {
        return sets.sort((a, b) => a.orderNumber - b.orderNumber);
    };

    const onComplete = () => {
        // Update all sets before changing location
        router.push(`/trainings/${router.query.id}`);
    };

    // Loading animation while fetching data
    if (loadSetsQuery.isLoading) {
        return <LoadingPage />;
    }

    // If the exercise is not found, show an error
    if (loadSetsQuery.isError) {
        router.push("/404");
        return <div>Exercise not found</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-5/6">
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="relative z-10 w-3/5 max-w-md py-4">
                        <SelectExerciseType
                            initialType={loadSetsQuery.data?.data.exerciseType?.name}
                            exerciseId={router.query?.exerciseId as string}
                        />
                    </div>
                    <Button className="w-2/6 max-w-sm bg-blue-400 hover:bg-blue-300" onClick={onComplete}>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon />
                            <span className="font-medium">Complete</span>
                        </div>
                    </Button>
                </div>
                {loadSetsQuery.isSuccess && (
                    <div className="flex flex-col gap-4">
                        {sortSets(loadSetsQuery.data?.data).map((set: Set) => {
                            return <TrainingsSetComponent key={set.id} set={set} />;
                        })}
                    </div>
                )}

                <div className="relative flex justify-center p-4">
                    <Button
                        variant="big"
                        onClick={() => {
                            addSetMutation.mutate({
                                exerciseEventId: router.query.exerciseId ?? "",
                                weight: 0,
                                reps: 0,
                            });
                        }}
                        isLoading={addSetMutation.isLoading}
                    >
                        <AddIcon boxSize={"4"} />
                        Add set
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Make sure the user is logged in before rendering this page.
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
