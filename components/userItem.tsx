import {Card, CardBody, CardHeader} from "@chakra-ui/react";
import {Heading, Text} from "@chakra-ui/layout";

interface UserItemInterface {
    firstName: string,
    lastName: string,
    username: string,
    role: string,
    id: number
}


export default function UserItem(props: UserItemInterface) {
    return (
        <div>
            <Card shadow={6} variant={"outline"} size={"sm"}>
                <CardHeader>
                    <Heading size={"sm"}>{"Full name: " + props.firstName + " " + props.lastName}</Heading>
                    <Text>{"ID: " + props.id}</Text>
                </CardHeader>
                <CardBody>
                    <div>{"Username: " + props.username}</div>
                    <div>{"Role: " + props.role}</div>
                </CardBody>
            </Card>

        </div>
    )
}