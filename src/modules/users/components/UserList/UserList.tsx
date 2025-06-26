"use server";

import { Container, Flex, Title } from "@mantine/core";
import { db } from "~/server/db";

import UserListItem from "../UserListItem/UserListItem";

export async function UserList() {
    const users = await db.user.findMany();
    return (
        <Flex
            direction={"column"}
            w={"100%"}
            h={"100%"}
            gap={"xs"}
            justify={"center"}
            align={"center"}
            style={{ flexGrow: 1 }}
            p={"lg"}
        >
            <Container w={"100%"}>
                <Flex direction={"column"} w={"100%"} gap={"xs"}>
                    <Title>Users</Title>
                    {users.map((user) => (
                        <UserListItem key={user.id} user={user} />
                    ))}
                </Flex>
            </Container>
        </Flex>
    );
}
