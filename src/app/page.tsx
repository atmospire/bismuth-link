"use client";

import { Flex } from "@mantine/core";
import { Banner } from "~/modules";

export default function Home() {
    return (
        <Flex
            direction={"column"}
            w={"100%"}
            h={"100%"}
            gap={"xs"}
            justify={"center"}
            align={"center"}
            style={{ flexGrow: 1 }}
        >
            <Flex direction={"column"} gap={"xs"} w={"100%"}>
                <Banner />
            </Flex>
        </Flex>
    );
}
