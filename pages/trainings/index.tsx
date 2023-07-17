import { useEffect, useState } from "react";
import { getAllTrainings } from "@/services/axiosInstance";
import TrainingItem, {
  TrainingItemInterface,
} from "@/components/training/TrainingItem";
import Router from "next/router";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const toast = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    getAllTrainings()
      .then((res) => {
        setTrainings(res.data);
      })
      .catch(() => {
        toast({
          title: "Cannot access this page",
          description: "You have to login first.",
          status: "error",
          variant: "left-accent",
          duration: 4000,
        });
        Router.push("/auth/login");
      });
  }, [toast]);

  return (
    <div
      className={"flex flex-col-reverse items-center gap-4 pt-4 min-h-screen"}
    >
      {trainings.map((training: TrainingItemInterface, i) => (
        <TrainingItem key={i} {...training} />
      ))}
    </div>
  );
}
