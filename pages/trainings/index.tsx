import { useCallback, useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, {
  TrainingItemInterface,
} from "@/components/training/TrainingItem";
import { useToast, Skeleton, SkeletonText } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import AddTrainingComponent from "@/components/training/AddTrainingComponent";
import { compareAsc, compareDesc } from "date-fns";

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
      );
  }, [toast])

  useEffect(() => {
    if (!session) return;
    loadItems();
  }, [toast, session, loadItems]);

  return (
    <div className={"flex flex-col items-center gap-4 pt-4 min-h-screen"}>
      {trainings.map((training: TrainingItemInterface, i) => (
        <TrainingItem key={i} {...training} reloadItems={loadItems} />
      ))}

      {!isTrainingRunning && <AddTrainingComponent reloadItems={loadItems} />}
    </div>
  );
}
