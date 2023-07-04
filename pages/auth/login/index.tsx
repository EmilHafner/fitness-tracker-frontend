import React, {useState} from "react";
import {
    FormControl, FormLabel,
    Alert, AlertIcon
} from "@chakra-ui/react";
import {Input, Button} from "@chakra-ui/react";
import {loginUser} from "@/services/auth.service";
import {useToast} from "@chakra-ui/react";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loginError, setLoginError] = useState(false)
    const toast = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)
        loginUser(username, password).then((res) => {
            console.log(res);
            toast({
                title: "Login successful",
                variant: "left-accent",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            localStorage.setItem('fitnessAppToken', res.data.token)
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
                    className={"flex flex-col w-1/4 gap-3 bg-gray-50 p-10 rounded-2xl outline outline-1 outline-blue-400"}
                    onSubmit={handleSubmit}>
                    <h1 className={"text-3xl font-bold pb-3"}>Login</h1>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input type={"text"} placeholder={"Username"}
                               value={username} onChange={(event) => setUsername(event.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input type={"password"} placeholder={"Password"}
                               value={password} onChange={(event) => setPassword(event.target.value)}/>
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