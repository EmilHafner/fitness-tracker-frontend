"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {FormControl, FormLabel, FormErrorMessage, Button, Input} from "@chakra-ui/react";
import {useToast} from "@chakra-ui/react";
import {registerUser} from "@/services/auth.service";

export default function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedBefore, setSubmittedBefore] = useState(false)
    const router = useRouter();
    const toast = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmittedBefore(true);

        registerUser(firstName, lastName, username, password).then((res) => {
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
                        className={"flex flex-col w-96 gap-3 bg-gray-50 p-10 rounded-2xl outline outline-1 outline-blue-400"}
                        onSubmit={handleSubmit}>
                        <h1 className={"text-3xl font-bold"}>Register</h1>
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