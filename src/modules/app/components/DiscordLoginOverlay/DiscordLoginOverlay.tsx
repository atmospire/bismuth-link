"use client";

import { Button, Flex, Overlay, Title } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { Logo } from "~/modules/layout";
import { signIn } from "next-auth/react";

export function DiscordLoginOverlay() {
    // zIndex 100 is navbar, 99 ensures you can interact with navbar still
    return (
        <Overlay center blur={4} zIndex={99}>
            <Flex direction={"column"} gap={"xl"}>
                <Logo goHomeOnClick={false} />
                <Title>This website requires you to be logged in.</Title>
                <Button leftSection={<IconBrandDiscord />} size="xl" onClick={() => signIn("discord")}>
                    Login via Discord
                </Button>
            </Flex>
        </Overlay>
    );
}
