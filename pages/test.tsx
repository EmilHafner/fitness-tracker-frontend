import {Box, AbsoluteCenter, Center, FormControl, FormLabel, Input, FormErrorMessage, Button} from "@chakra-ui/react";
import React from "react";


export default function Test() {
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordConfirm, setPasswordConfirm] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submittedBefore, setSubmittedBefore] = React.useState(false)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        return 0;
    }

    return (
        <div className={"h-full w-full bg-gray-400"}>
            <AbsoluteCenter>
                <Box maxW={"md"} minW={"sm"} p={6}
                     borderWidth={"1px"} rounded={10} bg={"gray.100"}>
                    <Center>
                        <form className={"flex flex-col gap-2"} onSubmit={handleSubmit} >
                        <h1 className={"text-2xl"}>Create new User</h1>
                            <FormControl isInvalid={!firstName && submittedBefore}>
                                <FormLabel>First Name</FormLabel>
                                <Input type={"text"} placeholder={"First Name"} value={firstName} required={true}
                                       onChange={(event) => setFirstName(event.target.value)}/>
                                <FormErrorMessage>First name is required.</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!lastName && submittedBefore}>
                                <FormLabel>Last Name</FormLabel>
                                <Input type={"text"} placeholder={"Last Name"} value={lastName} required={true}
                                       onChange={(event) => setLastName(event.target.value)}/>
                                <FormErrorMessage>Last name is required.</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!username && submittedBefore}>
                                <FormLabel>Username</FormLabel>
                                <Input type={"text"} placeholder={"Username"} value={username} required={true}
                                       onChange={(event) => setUsername(event.target.value)}/>
                                <FormErrorMessage>Username is required.</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={password.length < 8 && submittedBefore}>
                                <FormLabel>Password</FormLabel>
                                <Input type={"password"} placeholder={"Password"} value={password} required={true}
                                       minLength={8} onChange={(event) => setPassword(event.target.value)}/>
                                <FormErrorMessage>Password must be at least 8 characters long.</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={password != passwordConfirm && password.length >= 8}>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input type={"password"} placeholder={"Password"} value={passwordConfirm}
                                       required={true}
                                       onChange={(event) => setPasswordConfirm(event.target.value)}/>
                                <FormErrorMessage>Passwords have to be the same!</FormErrorMessage>
                            </FormControl>
                            <Button type={"submit"} colorScheme={"blue"} variant={"outline"} disabled={isSubmitting}
                                    isLoading={isSubmitting}>Register</Button>
                        </form>
                    </Center>
                </Box>
            </AbsoluteCenter>
        </div>

    )
}