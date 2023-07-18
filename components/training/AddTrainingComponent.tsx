import { saveTraining } from "@/services/axiosInstance";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddTrainingComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customDate, setCustomDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const toast = useToast();
  const router = useRouter();
  // TODO: Get all plans from backend

  function addTraining() {
    saveTraining(startDate)
      .then((t) => {
        toast({
          title: "Added a training",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/trainings/" + t.data.id);
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "Error",
          variant: "left-accent",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => onClose());
  }

  return (
    <div>
      <div className={"fixed bottom-20 left-1/2 -translate-x-1/2 font-medium"}>
        <button
          className={
            "p-4 shadow-2xl outline outline-2 outline-accent-muted rounded-2xl bg-accent hover:bg-accent-muted"
          }
          onClick={onOpen}
        >
          Start new Training
        </button>
      </div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start new Training</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h2 className={"text-lg font-medium"}>Choose a plan</h2>
            <Select placeholder="No plan" pb={4}>
              <option value="Option 1">Option 1</option>
            </Select>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <h3 className={"text-md font-medium"}>
                  {customDate ? "Enter Date and time" : "Starts now"}
                </h3>
                <button
                  className="hover:bg-gray-200 bg-gray-100 text-primary-dark rounded-md px-4 py-2"
                  onClick={() => setCustomDate(!customDate)}
                >
                  {customDate
                    ? "Change startdate"
                    : "Use current date and time"}
                </button>
              </div>

              <div className="flex flex-row gap-4">
                {customDate ? (
                  <div className="flex gap-2 justify-between w-full">
                    <Input type="date" />
                    <Input type="time" />
                  </div>
                ) : (
                  <div className="flex gap-2 justify-between w-full">
                    <div className="py-2 px-4 font-medium">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="py-2 px-4 font-medium">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="py-2 px-4 mr-4 rounded-lg font-medium bg-white hover:bg-gray-100"
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button
              className="py-2 px-4 rounded-lg font-medium bg-accent hover:bg-accent-muted"
              onClick={addTraining}
            >
              Create
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
