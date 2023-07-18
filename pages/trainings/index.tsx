import { useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, {
  TrainingItemInterface,
} from "@/components/training/TrainingItem";
import { useToast } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import AddTrainingComponent from "@/components/training/AddTrainingComponent";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
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
        setTrainings(res.data);
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
    <div
      className={"flex flex-col-reverse items-center gap-4 pt-4 min-h-screen"}
    >
      {trainings.map((training: TrainingItemInterface, i) => (
        <TrainingItem key={i} {...training} />
      ))}
      <AddTrainingComponent />
    </div>
  );
}
