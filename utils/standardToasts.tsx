import { UseToastOptions } from "@chakra-ui/react";


export const errorToast = (title: string, errorMessage: string) => {
    return {
        title: title,
        description: errorMessage,
        status: "error",
        variant: "left-accent",
        duration: 3000,
        isClosable: true,
    } as UseToastOptions;
}