import { useCallback, useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, {
  TrainingItemInterface,
} from "@/components/training/TrainingItem";
import { useToast, Skeleton, SkeletonText } from "@chakra-ui/react";
import { getSession, signIn, useSession } from "next-auth/react";
import AddTrainingComponent from "@/components/training/AddTrainingComponent";
import { compareAsc, compareDesc } from "date-fns";
import { GetServerSideProps } from "next";

interface TrainingInterface {
  id: number;
  userId: number;
  startDateTime: Date;
  endDateTime: Date;
}

export default function Trainings() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [isTrainingRunning, setIsTrainingRunning] = useState(true);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      toast({
        title: "Cannot access this page",
        description: "You have to login first.",
        status: "error",
        variant: "left-accent",
        duration: 4000,
        isClosable: true,
      });
      signIn();
    },
  });

  const loadItems = useCallback((): void => {
    setIsLoading(true);
    getAllTrainings()
      .then((res) => {
        let arr: Array<any> = res.data;
        arr = arr.sort((a: TrainingInterface, b: TrainingInterface) =>
          compareDesc(new Date(a.startDateTime), new Date(b.startDateTime))
        );
        // Check if there is a training running
        if (arr.filter((a) => !a.endDateTime).length > 0) {
          setIsTrainingRunning(true);
        } else {
          setIsTrainingRunning(false);
        }
        setTrainings(arr);
      })
      .catch((e) =>
        toast({
          title: "An Error occured",
          description: e.message,
          status: "error",
          variant: "left-accent",
          duration: 4000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  }, [toast]);

  useEffect(() => {
    if (!session) return;
    loadItems();
  }, [toast, session, loadItems]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 pt-4 min-h-screen">
        {[...Array(5)].map((key) => (
          <div key={key} className="rounded-xl h-32 w-5/6">
            <Skeleton height="100%" width="100%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={"flex flex-col items-center gap-4 pt-4 min-h-screen"}>
      {trainings.map((training: TrainingItemInterface, i) => (
        <TrainingItem key={i} {...training} reloadItems={loadItems} />
      ))}

      {!trainings.length && (
        <div className={"flex flex-col items-center gap-4 pt-4 min-h-screen"}>
          <p className={"text-2xl font-bold"}>No trainings found</p>
          <p className={"text-xl"}>
            Start a new training by clicking the button below
          </p>
        </div>
      )}

      {!isTrainingRunning && <AddTrainingComponent reloadItems={loadItems} />}
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
