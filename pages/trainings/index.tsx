import { useCallback, useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, { TrainingItemInterface } from "@/components/training/TrainingItem";
import { useToast, Skeleton } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import AddTrainingComponent from "@/components/training/AddTrainingComponent";
import { compareDesc } from "date-fns";
import { GetServerSideProps } from "next";
import { ExerciseEvent } from "./[id]";
import { useQuery } from "@tanstack/react-query";
import { Fade, ScaleFade, Slide, SlideFade, Collapse } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingPage from "@/components/loading/LoadingPage";

interface TrainingInterface {
    id: number;
    userId: number;
    startDateTime: Date;
    endDateTime: Date;
    exerciseEvents: ExerciseEvent[];
}

export default function Trainings() {
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const [isTrainingRunning, setIsTrainingRunning] = useState(true);

    const getAllTrainingsQuery = useQuery({
        queryKey: ["trainings"],
        queryFn: getAllTrainings,
    });

    useEffect(() => {
        if (getAllTrainingsQuery.status === "error") {
            toast({
                title: "An Error occured",
                description: "Unexpected Error",
                status: "error",
                variant: "left-accent",
                duration: 4000,
                isClosable: true,
            });
        }
    }, [getAllTrainingsQuery.status, toast]);

    const trainingIsRunning = (arr: TrainingInterface[]) => {
        return arr.filter((training) => !training.endDateTime).length > 0;
    };

    const sortTrainings = (arr: TrainingInterface[]) => {
        return arr.sort((a: TrainingInterface, b: TrainingInterface) =>
            compareDesc(new Date(a.startDateTime), new Date(b.startDateTime))
        );
    };

    if (getAllTrainingsQuery.isLoading) {
        return <LoadingPage />;

        return (
            <div className="flex min-h-screen flex-col items-center gap-4 pt-4">
                {[...Array(5)].map((key) => (
                    <div key={key} className="h-32 w-5/6 rounded-xl">
                        <Skeleton height="100%" width="100%" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={"flex min-h-screen flex-col items-center gap-4 pt-4"}>
            {sortTrainings(getAllTrainingsQuery.data?.data as TrainingInterface[]).map(
                (training: TrainingItemInterface, i) => (
                    <motion.div
                        className="flex w-full justify-center"
                        key={training.id}
                        initial={{ opacity: 0, x: "-80vw" }}
                        animate={{ opacity: 1, x: "0" }}
                        transition={{ delay: 0.1 * i, duration: 0.9 }}
                    >
                        <TrainingItem {...training} />
                    </motion.div>
                )
            )}

            {!getAllTrainingsQuery.data?.data.length && (
                <div className={"flex min-h-screen flex-col items-center gap-4 pt-4"}>
                    <p className={"text-2xl font-bold"}>No trainings found</p>
                    <p className={"text-xl"}>Start a new training by clicking the button below</p>
                </div>
            )}

            {!trainingIsRunning(getAllTrainingsQuery.data?.data as TrainingInterface[]) && <AddTrainingComponent />}
        </div>
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
