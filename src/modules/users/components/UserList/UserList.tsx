"use server";

import { Button, Flex, Title } from "@mantine/core";
import { db } from "~/server/db";

import UserListItem from "../UserListItem/UserListItem";

export async function UserList() {
    const users = await db.user.findMany();
    return (
        <Flex direction={"column"} w={"100%"}>
            <Title>Users</Title>
            <Button>Add user</Button>
            {users.map((user) => (
                <UserListItem key={user.id} user={user} />
            ))}
        </Flex>
    );
}
