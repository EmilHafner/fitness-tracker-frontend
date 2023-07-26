import Button from "@/components/basics/Button";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  InputGroup,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useEffect, useState } from "react";
import { axiosI } from "@/services/axiosInstance";

interface Exercise {
  id?: number;
  name: string;
  bodypart: string;
}

export default function Exercises() {
  const {
    isOpen: modalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [bodyParts, setBodyParts] = useState([]);
  const [exercises, setExercises] = useState([] as Exercise[]);
  const [exerciseToSave, setExerciseToSave] = useState(
    {} as Exercise
  );
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState(-1);

  useEffect(() => {
    setIsLoading(true);
    axiosI
      .get("/exercises/bodyparts")
      .then((res) => {
        setBodyParts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    console.log("Loading exercises")
    loadExercises();
  }, []);

  const loadExercises = () => {
    axiosI
      .get("/exercises/all")
      .then((res:  {data: Exercise[]}) => {
        setExercises(res.data.sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name)))
      })
      .catch((err) => {
        console.error(err);
      }).finally(() => {
        setIsLoading(false);
        setDeletingId(-1);
      });
  };

  const saveExercise = () => {
    setSubmitting(true);
    console.log(exerciseToSave);
    axiosI
      .post("/exercises/add", exerciseToSave)
      .then((res) => {
        console.log(res);
        loadExercises();
        onModalClose();
        setExerciseToSave({} as { name: string; bodypart: string });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const deleteExerise = (id: number) => {
    setDeletingId(id);
    axiosI
      .delete("/exercises/delete/" + id)
      .then((res) => {
        console.log(res);
        loadExercises();
      })
      .catch((err) => {
        console.error(err);
        setDeletingId(-1);
      });

  };

  const cancelEdit = () => {
    setIsEditing(false);
    setExerciseToSave({} as { name: string; bodypart: string });
    onModalClose();
  }


  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="w-5/6 py-4 flex flex-col gap-2">
          {/* List of all exercises */}
          {!isLoading && exercises.map((v: any) => {
            return (
              <div
                key={v.id}
                className="flex flex-row justify-between items-center py-2 px-4 bg-slate-200 rounded-xl shadow-xl mb-2"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="font-medium">{v.name}</h1>
                  <p className="text-sm text-gray-500">{v.bodypart}</p>
                </div>
                <div className="flex flex-row gap-4">
                  <Button 
                  variant="normal" 
                  onClick={() => {
                    setIsEditing(true);
                    setExerciseToSave(v);
                    onModalOpen();
                  }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="normal"
                    className="bg-abort hover:bg-abort-muted"
                    onClick={() => deleteExerise(v.id)}
                    isLoading={deletingId == v.id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}

          {/* While exercises are loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 min-h-screen">
              {[...Array(10)].map((key) => (
                <div key={key} className="rounded-xl h-16 w-full">
                  <div className="animate-pulse h-full w-full bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      

      {/* Button to add a new exercise (opens a Modal) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
        <Button variant="big" onClick={onModalOpen}>
          Add Exercise
        </Button>

        <Modal isOpen={modalOpen} isCentered={true} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditing ? "Edit exercise" : "New exercise"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="font-medium pb-2">Exercise name</h1>
                  <InputGroup>
                    <Input
                      placeholder="Exercise Name"
                      value={exerciseToSave.name}
                      onChange={(e) =>
                        setExerciseToSave({
                          ...exerciseToSave,
                          ["name"]: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </div>
                <div>
                  <h1 className="font-medium pb-2">Main body part</h1>
                  <Select
                    value={exerciseToSave.bodypart}
                    onChange={(e) =>
                      setExerciseToSave({
                        ...exerciseToSave,
                        ["bodypart"]: e.target.value,
                      })
                    }
                  >
                    <option value="Null">Not selected</option>
                    {bodyParts.map((v: any, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="flex flex-row gap-4">
                <Button
                  className="bg-slate-200 hover:bg-slate-300"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={submitting}
                  disabled={submitting}
                  onClick={saveExercise}
                >
                  {isEditing ? "Save" : "Create"}
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth/login?callbackUrl=/exercises&error=notLoggedIn",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
