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
import { format } from "date-fns";

export default function AddTrainingComponent(props: {
  reloadItems: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const toast = useToast();
  // TODO: Get all plans from backend
  // TODO: Implement setting a custom startdate

  function addTraining() {
    // Format: 1995-12-17T03:24:00
    saveTraining(new Date(startDate + "T" + startTime + ":00"))
      .then((t) => {
        toast({
          title: "Added a training",
          variant: "left-accent",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        props.reloadItems();
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

  const openModal = () => {
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setStartTime(format(new Date(), "HH:mm"));
    onOpen();
  };

  return (
    <div>
      <div className={"fixed bottom-20 left-1/2 -translate-x-1/2 font-medium"}>
        <button
          className={
            "p-4 shadow-2xl outline outline-2 outline-accent-muted rounded-2xl bg-accent hover:bg-accent-muted"
          }
          onClick={openModal}
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
            <div className="pb-6 pt-2">
              <Select placeholder="No plan">
                <option value="Option 1">Option 1</option>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <h3 className={"text-md font-medium"}>Enter Date and time</h3>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex gap-2 justify-between w-full">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
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
