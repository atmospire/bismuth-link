"use client";

import { Card, Flex, Text } from "@mantine/core";
import type { AllowedServer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import type { MinecraftServerStatusResponse } from "~/types/MinecraftServerStatusResponse";

interface ServerCardOptions {
    server: AllowedServer;
}

export function ServerCard({ server }: ServerCardOptions) {
    const { data: serverStatus } = useQuery<MinecraftServerStatusResponse>({
        queryKey: ["serverStatus", server.serverIp],
        queryFn: () => fetch(`https://api.mcsrvstat.us/3/${server.serverIp}`).then((res) => res.json()),
    });

    return (
        <Card w={"100%"}>
            <Flex align={"center"} justify={"space-between"} w={"100%"}>
                <Text c={"white"}>{server.serverIp}</Text>
                <Text c={"white"}>
                    {serverStatus?.players?.online}/{serverStatus?.players?.max}
                </Text>
            </Flex>
        </Card>
    );
}
