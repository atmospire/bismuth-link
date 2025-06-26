import { Flex } from "@mantine/core";
import { Authorized } from "~/modules";

export default async function AdminDashboardPage() {
    return (
        <Authorized role={"Admin"} redirectHome>
            <Flex direction={"column"} justify={"center"} w={"100%"}>
                work in progress, will show stats etc
            </Flex>
        </Authorized>
    );
}
