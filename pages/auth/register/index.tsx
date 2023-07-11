"use client";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {FormControl, FormLabel, FormErrorMessage, Button, Input, InputRightElement, InputGroup} from "@chakra-ui/react";
import {useToast} from "@chakra-ui/react";
import {registerUser} from "@/services/auth.service";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

export default function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [pwShown, setPwShown] = useState(false)
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedBefore, setSubmittedBefore] = useState(false)
    const router = useRouter();
    const toast = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmittedBefore(true);
        if (password !== passwordConfirm) {
            toast({
                title: "Passwords do not match",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                variant: "left-accent"
            });
            setIsSubmitting(false);
            return;
        }

        registerUser(firstName, lastName, username.toLowerCase(), password).then(() => {
            toast({
                title: "User created",
                description: "User with " + username + " was created. " +
                    "- Please login to continue.",
                status: "success",
                duration: 10000,
                isClosable: true,
                variant: "left-accent"
            })
            router.push("/auth/login")
        }).catch((err) => {
            if (err.response) {
                console.error(err.response.data)
                toast({
                    title: err.response.data.message,
                    description: err.response.data.errors,
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                    variant: "left-accent"
                });
            } else {
                toast({
                    title: "Something went wrong",
                    description: "Please try again later.",
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                    variant: "left-accent"
                })
            }
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <>
            <div className={"h-full"}>
                <div className={"flex flex-col justify-center items-center bg-gray-200 h-full"}>
                    <form
                        className={"flex flex-col w-96 gap-3 bg-gray-50 p-10 rounded-2xl " +
                            "outline outline-2 outline-blue-50 shadow-lg"}
                        onSubmit={handleSubmit}>
                        <h1 className={"text-2xl font-bold"}>Create a new Account</h1>
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
                            <InputGroup>
                                <Input type={pwShown ? "text":"password"} placeholder={"Password"} minLength={8} required={true}
                                       value={password} onChange={(event) => setPassword(event.target.value)}/>
                                <InputRightElement>
                                    <Button variant={"ghost"} h={"1.5rem"} mr={2} onClick={() => setPwShown(!pwShown)}>
                                        {pwShown ? (<ViewOffIcon/>) : (<ViewIcon/>)}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            <FormErrorMessage>Password must be at least 8 characters long.</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={password != passwordConfirm && password.length >= 8}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type={"password"} placeholder={"Password"} value={passwordConfirm} required={true}
                                   onChange={(event) => setPasswordConfirm(event.target.value)}/>
                            <FormErrorMessage>Passwords have to be the same!</FormErrorMessage>
                        </FormControl>
                        <Button type={"submit"} colorScheme={"blue"} variant={"outline"} disabled={isSubmitting}
                                isLoading={isSubmitting}>Register</Button>
                    </form>
                    <span className={"py-1"}>Already have an account?</span>
                    <Button type={"button"} colorScheme={"green"} variant={"outline"}><a
                        href="/auth/login">Login</a></Button>
                </div>
            </div>
        </>

    )
}