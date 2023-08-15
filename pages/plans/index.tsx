import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { Plan } from "global-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addExerciseToPlan, createPlan, deletePlan, getAllPlans } from "@/services/exercisePlan.service";
import { addSetToExerciseEvent } from "@/services/axiosInstance";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Button from "@/components/basics/Button";
import { useRouter } from "next/router";
import { Divider } from "@chakra-ui/react";

export default function Plans() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const loadPlansQuery = useQuery({
        queryKey: ["plans"],
        queryFn: () => getAllPlans(),
    });

    const addPlanMutation = useMutation({
        mutationFn: createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    const deletePlanMutation = useMutation({
        mutationFn: deletePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    const plans = loadPlansQuery.data?.data as Plan[];

    return (
        <div className="flex w-full flex-col items-center gap-4 pb-4">
            <div className="flex w-5/6 flex-col gap-2">
                {plans?.map((plan) => (
                    <div key={plan.id} className="flex justify-between rounded-lg border-2 bg-stone-100 px-4 py-2">
                        <div className="w-full mr-12">
                            <h1 className="text-sm sm:text-base font-bold text-stone-800">{plan.name}</h1>
                            <h2 className="text-xs sm:text-sm text-stone-600">{plan.description}</h2>
                            <span className=""></span>
                            {plan.exercises && <div className="divider"></div>}
                            {plan.exercises?.map((exercise) => (
                                <div key={exercise.id}>
                                    <h3>{exercise.name}</h3>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex gap-4 items-center">
                            <button className="border-2 border-stone-500 rounded-lg hover:bg-stone-500 hover:text-stone-50 transition w-8 h-8 flex items-center justify-center" onClick={() => router.push(`/plans/${plan.id}`)}>
                                <EditIcon />
                            </button>
                            <button className="border-2 border-abort-muted rounded-lg hover:bg-abort-muted hover:text-stone-50 transition w-8 h-8 flex items-center justify-center" onClick={() => deletePlanMutation.mutate(plan.id)}>
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <Button variant="normal" className="px-6" onClick={() => addPlanMutation.mutate({ name: "Plan 1", description: "This is plan 1" })}>
                    Add Plan
                </Button>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session?.user) {
        return {
            redirect: {
                destination: "/auth/login?callbackUrl=/plans&error=notLoggedIn",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
