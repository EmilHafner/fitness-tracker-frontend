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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

export default function Exercises() {
  const {
    isOpen: modalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  return (
    <div>
      <div>Liste </div>
      <div>
        <Button className="" onClick={onModalOpen}>
          Add Exercise
        </Button>

        <Modal isOpen={modalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Modal</ModalBody>

            <ModalFooter>
              <Button onClick={onModalClose}>Close</Button>
              <Button>Secondary Action</Button>
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
