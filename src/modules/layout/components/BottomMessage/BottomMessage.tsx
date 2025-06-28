"use client";

import Link from "next/link";
import { Flex, Text } from "@mantine/core";
import { Routes } from "~/constants/routes";
import { useSession } from "next-auth/react";

export function BottomMessage() {
    const session = useSession({ required: false });

    if (!session.data) {
        return null;
    }

    if (session.data && (!session.data.user.javaName || !session.data.user.bedrockName)) {
        return (
            <Flex
                pos={"absolute"}
                bottom={0}
                w={"100%"}
                h={"2rem"}
                bg={"black"}
                justify={"center"}
                align={"center"}
                style={{ zIndex: 200, borderTop: "1px solid #222" }}
                href={Routes.LINKING}
                component={Link}
            >
                <Text>Link your Microsoft account!</Text>
            </Flex>
        );
    }

    return null;
}
