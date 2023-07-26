import { axiosI } from "@/services/axiosInstance";
import { AddIcon } from "@chakra-ui/icons";
import { Skeleton, useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";

interface Set {
  id: number;
  weight?: number;
  reps?: number;
}
interface Exercise {
  id: number;
  name: string;
  bodypart?: string;
  sets?: Array<Set>;
}
interface Training {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
  exercises?: Array<Exercise>;
}

export default function Training() {
  const router = useRouter();
  const [training, setTraining] = useState({} as Training);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [loadNewExercise, setLoadNewExercise] = useState(false);


  // Load training from API
  const loadTraining = useCallback(() => {
    return axiosI
      .get(`/training/${router.query.id}`)
      .then((res) => {
        setTraining(res.data);
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "An Error occured",
          description: e.message,
          status: "error",
          variant: "left-accent",
          duration: 4000,
          isClosable: true,
        });
      });
  }, [router.query.id, toast]);

  // Load training on first render
  useEffect(() => {
    setIsLoading(true);
    loadTraining().then(() => {
      setIsLoading(false);
    });
  }, [loadTraining, toast]);

  // Add or update an exercise to the training
  const addOrUpdateExerciseInTraining = (exercise?: Exercise) => {
    // If exercise is undefined, create a new empty exercise

    //axiosI.post(`/training/${router.query.id}/exercise/add`, exercise);

    // For now just wait 1 second and set loadNewExercise to true then false
    // Just for implementing the skeleton loading
    setLoadNewExercise(true);
    setTimeout(() => {
      setLoadNewExercise(false);
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center ">
      <div className="flex w-5/6 flex-col gap-4">
        {router.query.id}
        <br />
        {training?.startDateTime &&
          format(new Date(training.startDateTime), "dd.MM.yyyy HH:mm")}

        <AddExerciseComponent onClick={addOrUpdateExerciseInTraining} />
        {loadNewExercise && <ExerciseSkeleton />}
        {training.exercises?.map((exercise) => {
          return <ExerciseComponent key={exercise.id} exercise={exercise} />;
        })}
        
      </div>
    </div>
  );
}

function AddExerciseComponent({onClick} : {onClick: () => void}) {
  return (
    <button
      className="flex h-24 w-full flex-col items-center justify-center
    rounded-xl shadow-lg  outline outline-1 outline-slate-300 hover:bg-slate-200"
    onClick={onClick}
    >
      <AddIcon boxSize={"6"} className="" />
      Add Exercise
    </button>
  );
}

function ExerciseComponent(props: { exercise: Exercise }) {
  return (
    <div className=" flex h-24 w-full flex-row items-center justify-center rounded-lg bg-slate-50 shadow-lg">
      {props.exercise.name}
    </div>
  );
}

function ExerciseSkeleton() {
  return (
    <Skeleton className="h-24 w-full" rounded={10}>
      
    </Skeleton>
  )
}
