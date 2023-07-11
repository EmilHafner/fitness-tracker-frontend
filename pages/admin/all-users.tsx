import {useEffect, useState} from "react";
import {getAllUsers} from "@/services/axiosInstance"
import Router from "next/router"
import UserItem from "@/components/userItem"
import {Stack} from "@chakra-ui/layout";
import {useToast} from "@chakra-ui/react";

export default function AllUsers() {
    const [userList, setUserList] = useState([]);
    const toast = useToast();

    useEffect(() => {
            getAllUsers().then(res => {
                setUserList(res.data)
                console.log(res.data)
            }).catch(
                err => {
                    toast({
                        title: "Access denied",
                        description: "You are not authorized to view this page.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        variant: "left-accent"
                    })
                    Router.push('/auth/login')
                }
            );
        }
        ,
        [toast]
    )


    return (
        <div className={"px-20 pt-5"}>
            <Stack spacing={4}>
                {userList.map((v: any, i) => {
                    return <UserItem key={i}
                                     firstName={v.firstName}
                                     lastName={v.lastName}
                                     id={v.id}
                                     username={v.username}
                                     role={v.role}/>
                })}
            </Stack>

        </div>
    )
}