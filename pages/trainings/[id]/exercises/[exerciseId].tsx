import { getExerciseEventById } from "@/services/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { ExerciseEvent } from "..";
import { useSets } from "@/hooks/useSets";
import Button from "@/components/basics/Button";
import LoadingPage from "@/components/loading/LoadingPage";
import TrainingsSetComponent from "@/components/training/exercise/TrainingsSetComponent";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import SelectExerciseType from "@/components/training/exercise/SelectExerciseType";

export default function Exercise() {
    const router = useRouter();
    const [exerciseEvent, setExerciseEvent] = useState<ExerciseEvent>({} as ExerciseEvent);
    const { sets, addSet, saveSets, changeSetLocally } = useSets(parseInt(router.query?.exerciseId as string));
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

    const onComplete = () => {
        saveSets();
        router.push(`/trainings/${router.query.id}`);
    }

    // Loading animation while fetching data
    if (exerciseEventLoading) {
        return <LoadingPage />;
    }

    // If the exercise is not found, show an error
    if (loadingError) {
        router.push("/404");
        return <div>Exercise not found</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-5/6">
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="relative z-10 w-3/5 max-w-md py-4">
                        <SelectExerciseType
                            initialType={exerciseEvent.exerciseType?.name}
                            exerciseId={router.query?.exerciseId as string}
                        />
                    </div>
                    <Button className="w-2/6 max-w-sm bg-blue-400 hover:bg-blue-300"
                    onClick={saveSets}>
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon />
                            <span className="font-medium">Complete</span>
                        </div>
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {sets.map((set) => {
                        return <TrainingsSetComponent key={set.id} set={set} changeSetLocally={changeSetLocally} />;
                    })}
                </div>

                <div className="relative flex justify-center p-4">
                    <Button
                        variant="big"
                        onClick={() => {
                            addSet({});
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