import { Flex } from "@mantine/core";
import { Authorized, UserList } from "~/modules";

// Force dynamic rendering to prevent prerendering during build
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    return (
        <Authorized role={"Admin"} redirectHome>
            <Flex direction={"column"} justify={"center"} w={"100%"}>
                <UserList />
            </Flex>
        </Authorized>
    );
}
