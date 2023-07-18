import { useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, {
  TrainingItemInterface,
} from "@/components/training/TrainingItem";
import { useToast, Skeleton, SkeletonText } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import AddTrainingComponent from "@/components/training/AddTrainingComponent";
import { compareAsc, compareDesc } from "date-fns";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
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

  useEffect(() => {
    if (!session) return;
    getAllTrainings()
      .then((res) => {
        let arr: Array<any> = res.data;
        console.log(arr);
        arr = arr.sort(
          (a: any, b: any) => compareDesc(a.startDateTime, b.startDateTime) // ! This doesnt work, I dont know why!
        );
        console.log(arr);
        setTrainings(arr); // ! Trainings are still unsorted
        setIsLoading(false);
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
  }, [toast, session]);

  if (!session) return null;

  return (
    <div className={"flex flex-col items-center gap-4 pt-4 min-h-screen"}>
      {trainings.map((training: TrainingItemInterface, i) => (
        <TrainingItem key={i} {...training} />
      ))}

      <AddTrainingComponent />
    </div>
  );
}
