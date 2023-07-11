import React, {useState} from "react";
import {
    FormControl, FormLabel,
    Alert, AlertIcon
} from "@chakra-ui/react";
import {Input, Button, InputGroup, InputRightElement} from "@chakra-ui/react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {loginUser} from "@/services/auth.service";
import {useToast} from "@chakra-ui/react";
import Link from "next/link";
import Router from "next/router";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [pwShown, setPwShown] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loginError, setLoginError] = useState(false)
    const toast = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        loginUser(username.toLowerCase(), password).then((res) => {
            console.log(res);
            toast({
                title: "Login successful",
                variant: "left-accent",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            localStorage.setItem('fitnessAppToken', res.data.token)
            Router.push('/')
        }).catch((err) => {
            console.log(err);
            setPassword('')
            setLoginError(true);
            toast({
                title: "Login failed",
                variant: "left-accent",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        }).finally(() => {
            setIsSubmitting(false)
        });
    }

    return (
        <div className={"h-full"}>
            <div className={"flex flex-col justify-center items-center bg-gray-200 h-full "}>
                <form
                    className={"flex flex-col w-96 gap-3 bg-gray-50 p-10 rounded-2xl " +
                        "outline outline-2 outline-blue-50 shadow-lg"}
                    onSubmit={handleSubmit}>
                    <h1 className={"text-2xl font-bold pb-3"}>Log in to your account</h1>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input type={"text"} placeholder={"Username"}
                               value={username} onChange={(event) => setUsername(event.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input type={pwShown ? "text":"password"} placeholder={"Password"}
                                   value={password} onChange={(event) => setPassword(event.target.value)}/>
                            <InputRightElement>
                                <Button variant={"ghost"} h={"1.5rem"} mr={2} onClick={() => setPwShown(!pwShown)}>
                                    {pwShown ? (<ViewOffIcon/>) : (<ViewIcon/>)}
                                </Button>
                            </InputRightElement>

                        </InputGroup>

                    </FormControl>
                    {loginError && (
                        <Alert className={"rounded"} status="error">
                            <AlertIcon/>
                            Username or Password is incorrect.
                        </Alert>)}

                    <Button
                        type={"submit"}
                        colorScheme={"blue"}
                        variant={"outline"}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >Login</Button>
                </form>
                <span className={"py-1"}>Dont have an account yet?</span>
                <Link href={"/auth/register"}>
                    <Button type={"button"} colorScheme={"green"} variant={"outline"}>
                        Register
                    </Button>
                </Link>

            </div>
        </div>

    )
}