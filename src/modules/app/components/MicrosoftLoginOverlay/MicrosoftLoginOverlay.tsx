"use client";

import { Button, Flex, Overlay, Title } from "@mantine/core";
import { IconBrandMinecraft } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export function MicrosoftLoginOverlay() {
    // zIndex 100 is navbar, 99 ensures you can interact with navbar still
    return (
        <Overlay center blur={4} zIndex={99}>
            <Flex direction={"column"} gap={"xl"} maw={"85%"}>
                <Title order={2} ta={"center"}>
                    Link your Discord to your Minecraft Account!
                </Title>
                <Button leftSection={<IconBrandMinecraft />} size="xl" onClick={() => signIn("microsoft")}>
                    Login via Microsoft
                </Button>
            </Flex>
        </Overlay>
    );
}
